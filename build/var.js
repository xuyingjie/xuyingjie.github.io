//
// - 存储为单文件（方便缓存、搜索）
// - 存储文章和上传文件一样post
// - 标题排序（字母排序，修改时间排序）
// - 文件整体加密，云端存储格式(new Blob([ArrayBuffer]))
// - scrollLoad with decrypt
// ? 多种文件格式的显示
// ? 版本回溯
// ? js文件合并压缩
// ? "#/scratch": [ckeditor] 加密，没有标题，tag,修改时间排序
// ? "#/folder": asmcrypto.js 加密 {name:, path:}
// - indexedDB不需要清理(folder不需要cache)
//
// ? es6
// ! simplify function names
// ! 用 for(var i = 0; i < a.length; i++) 取代 for(var i in a)
//

//
// Docouments
// JavaScript: http://javascript.ruanyifeng.com/
// ReactRouter overview: https://github.com/rackt/react-router/blob/master/docs/guides/overview.md
// asmCrypto: https://github.com/vibornoff/asmcrypto.js#aes_cbc
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
var publicKey = 'GmPw2qjmTsAAUsqa';  // 存储前加密密钥

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
var ajaxArrayBuffer = function(opts){
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'arraybuffer';
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      uint8Arr = asmCrypto.AES_CBC.decrypt(xhr.response, opts.token);
      console.log("AES.decrypt");
      if (opts.json) {
        var str = Uint8ArrayToString(uint8Arr);
        opts.success(JSON.parse(str));
      } else {
        opts.success(uint8Arr);
      }
    }
  };
  if (opts.progress) {
    xhr.onprogress = function(e) {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
          opts.progress.innerHTML = (e.total/1024).toFixed(2) + "KB";
        } else {
          opts.progress.innerHTML = ((e.loaded/e.total)*100).toFixed(2) + "%";
        }
      }
    };
  }
  xhr.open("GET", opts.url, true);
  xhr.send(null);
};

var ajaxJson = function(opts){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
        // JSON.parse(xhr.responseText),将json字符串转化为json对象。
        if (xhr.responseText !== ''){
          opts.success(JSON.parse(xhr.responseText));
        }
      }
    }
  };
  xhr.open("GET", opts.url, true);
  xhr.send(null);
};


//
// oss post
//
var upload = function(opts) {

  var blob;
  if (opts.token) {
    var uint8Arr = asmCrypto.AES_CBC.encrypt(opts.data, opts.token);
    console.log("AES.encrypt");
    // new Blob([encList.buffer]) fast than new Blob([encList]) type不是必需的
    blob = new Blob([uint8Arr.buffer], {type: 'application/octet-stream'});
  } else {
    blob = opts.data;
  }

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
  // var policy = btoa(JSON.stringify(policyJson));
  // var signature = asmCrypto.HMAC_SHA1.base64(policy, OSSAccessKeySecret);

  var policy = window.localStorage.policy;
  var signature = window.localStorage.signature;

  var formData = new FormData();
  formData.append('OSSAccessKeyId', OSSAccessKeyId);
  formData.append('policy', policy);
  formData.append('signature', signature);

  formData.append('Content-Type', blob.type);
  formData.append('key', opts.key);
  formData.append("file", blob); // 文件或文本内容，必须是表单中的最后一个域。

  var xhr = new XMLHttpRequest();

  if (opts.progress) {
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        opts.progress.value = (e.loaded / e.total) * 100;
      }
    };
  }

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




//
// crypto
//
var timeDiff = function(){
  return Date.now() + '' + Math.floor(Math.random() * 9000 + 1000); // 或加入IP
};

// little fast than UTF8ArrToStr()
var Uint8ArrayToString = function(v){
  var str = "";
  for (var i = 0; i < v.length; i++) {
    str = str + String.fromCharCode(v[i]);
  }
  return str;
};

/*\
|*|
|*|  Base64 / binary data / UTF-8 strings utilities
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
|*|
\*/
// var Base64 = function(s){
//   var utf8 = strToUTF8Arr(s);
//   return base64EncArr(utf8);
// };
