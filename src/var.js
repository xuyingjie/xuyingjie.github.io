//
// - 存储为单文件（方便缓存、搜索）
// - 存储文章和上传文件一样post
// - 标题排序（字母排序，修改时间排序）
// ? 多种文件格式的显示
// ? 版本回溯
// ? js文件合并压缩
// ? "#/scratch": [ckeditor] 加密，没有标题，tag,修改时间排序
// ? "#/folder": asmcrypto.js 加密 {name:, path:}
// ? es6
//

//
// Docouments
// JavaScript: http://javascript.ruanyifeng.com/
// ReactRouter overview: https://github.com/rackt/react-router/blob/master/docs/guides/overview.md
//

//
// Global Variable
//
var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var bucket = 'kxmd';
var url = 'http://' + bucket + '.oss-cn-beijing.aliyuncs.com/';
var publicKey = 'FrtVDIUvAik';  // 存储前加密密钥

// or define in this.state
var local = "#/";       // 返回登录前页面
var refresh = false;    // 异步缓存时 传递刷新条件

// markdown converter
var converter = new Showdown.converter();


//
// indexedDB
//
var db = new Dexie(bucket);
db.version(1).stores({etc: 'id, version'});
db.version(1).stores({contents: 'id, arr'});
db.version(1).stores({set: 'id, arr'});
db.version(1).stores({encSet: 'id, arr'});
db.version(1).stores({section: 'id, title, content, timestamp'});
db.open();

// var a = 0;
// new Promise(function(resolve){
//   db.etc.get("version", function(data){
//     resolve(data);
//   });
// }).then(function(data){
//   a = data.version;
//   console.log("AA"+a);
// });


//
// ajax
// or use Promise
//
var ajax = function(opts){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
        // JSON.parse(xhr.responseText),将json字符串转化为json对象。
        if (xhr.responseText !== ''){
          opts.success(JSON.parse(xhr.responseText));
        }
      }else{
        opts.error(xhr.statusText);
      }
    }
  };
  xhr.open(opts.method, opts.url, true);

  // 模拟POST提交FormData。服务端$POST接收的是FormData。
  // 或者修改服务器端，接收JSON.stringify(opts.data)。
  // var formData = new FormData();
  // for (i in opts.data){
  //   formData.append(i, opts.data[i]);
  // }
  xhr.send(JSON.stringify(opts.data));
};


//
// crypto
//
var JsonFormatter = {
  stringify: function (cipherParams) {
    // create json object with ciphertext
    var jsonObj = {
      ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
    };

    // optionally add iv and salt
    if (cipherParams.iv) {
      jsonObj.iv = cipherParams.iv.toString();
    }
    if (cipherParams.salt) {
      jsonObj.s = cipherParams.salt.toString();
    }

    // stringify json object
    return JSON.stringify(jsonObj);
  },

  parse: function (jsonStr) {
    // parse json string
    var jsonObj = JSON.parse(jsonStr);

    // extract ciphertext from json object, and create cipher params object
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
    });

    // optionally extract iv and salt
    if (jsonObj.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
    }
    if (jsonObj.s) {
      cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
    }

    return cipherParams;
  }
};

var timeDiff = function(){
  return Date.now() + '' + Math.floor(Math.random() * 9000 + 1000); // 或加入IP
};
var Base64 = function(s){
  var utf8 = CryptoJS.enc.Utf8.parse(s);
  return CryptoJS.enc.Base64.stringify(utf8);
};
var SHA256 = function(s){
  return String(CryptoJS.SHA256(s));
};
var encrypt = function(s, passwd){
  var encrypted = CryptoJS.AES.encrypt(s, passwd, { format: JsonFormatter });
  return String(encrypted);
};
var decrypt = function(s, passwd){
  var decrypted = CryptoJS.AES.decrypt(s, passwd, { format: JsonFormatter });
  return decrypted.toString(CryptoJS.enc.Utf8);
};


//
// oss post
//
var upload = function(file, key, progress) {

  var OSSAccessKeyId = window.localStorage.OSSAccessKeyId;
  // var OSSAccessKeySecret = window.localStorage.OSSAccessKeySecret;
  //
  // var policyJson = {
  //   "expiration": "2024-12-01T12:00:00.000Z",
  //   "conditions": [
  //     {
  //       "bucket": bucket
  //     }
  //   ]
  // };
  // var policy = Base64(JSON.stringify(policyJson));
  // var signature = CryptoJS.HmacSHA1(policy, OSSAccessKeySecret).toString(CryptoJS.enc.Base64);

  var policy = window.localStorage.policy;
  var signature = window.localStorage.signature;

  var formData = new FormData();
  formData.append('OSSAccessKeyId', OSSAccessKeyId);
  formData.append('policy', policy);
  formData.append('signature', signature);

  formData.append('Content-Type', file.type);
  formData.append('key', key);
  formData.append("file", file); // 文件或文本内容，必须是表单中的最后一个域。

  var xhr = new XMLHttpRequest();

  var updateProgress = function(event) {
    if (event.lengthComputable) {
      var complete = (event.loaded / event.total * 100 | 0);
      progress.value = progress.innerHTML = complete;
    }
  };
  // xhr.upload.onprogress = function(event)...
  xhr.upload.addEventListener("progress", updateProgress, false);

  xhr.open("POST", url, true);
  xhr.send(formData);

  return xhr;
};

var insertText = function(obj, str) {
  if (document.selection) {
    var sel = document.selection.createRange();
    sel.text = str;
  } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
    var startPos = obj.selectionStart,
      endPos = obj.selectionEnd,
      cursorPos = startPos,
      tmpStr = obj.value;
    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    cursorPos += str.length;
    obj.selectionStart = obj.selectionEnd = cursorPos;
  } else {
    obj.value += str;
  }
};
