//
// - 存储为单文件（方便缓存、搜索）
// - 存储文章和上传文件一样post
// - 标题排序（字母排序，修改时间排序）
// - 文件整体加密，云端存储格式(new Blob([ArrayBuffer]))
// - scrollLoad with decrypt
// - 多种文件格式的显示
// ? 版本回溯
// - js文件合并压缩
// - "#/tasks": 加密,修改时间排序
// - "#/folder": asmcrypto.js 加密 {name:, path:}
//
// - es6
// ! simplify function names
// ! 用 for(var i = 0; i < a.length; i++) 取代 for(var i in a)
//

//
// Docouments
// JavaScript: http://javascript.ruanyifeng.com/
// asmCrypto: https://github.com/vibornoff/asmcrypto.js#aes_cbc
//


//
// Global Variable
//
const siteTitle = 'Structure';
const bucket = 'structure';
const publicKey = 'GmPw2qjmTsAAUsqa'; // 存储前加密密钥

const url = 'http://' + bucket + '.oss-cn-beijing.aliyuncs.com/';
// const url = 'http://' + bucket + '.kssws.ks-cdn.com/';
// const url = 'http://7teaz4.com1.z0.glb.clouddn.com/'; // POST: 'http://upload.qiniu.com'

// or define in this.state
var local = '#/'; // 返回登录前页面
var refresh = false; // 异步缓存时 传递刷新条件


//
// indexedDB
//
var db = new Dexie(bucket);
db.version(1).stores({
  etc: 'id, version'
});
db.version(1).stores({
  contents: 'id, arr'
});
db.version(1).stores({
  set: 'id, arr'
});
db.version(1).stores({
  section: 'id, title, content, timestamp'
});
db.open();


//
// ajax
// or use Promise
//
function ajaxArrayBuffer(opts) {
  "use strict";
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {

        let token = opts.token ? opts.token : (opts.encrypt ? localStorage.token : publicKey);
        let uint8Arr = asmCrypto.AES_CBC.decrypt(xhr.response, token);
        console.log("AES.decrypt");
        if (opts.uint8Arr) {
          opts.success(uint8Arr);
        } else {
          let str = UTF8ArrToStr(uint8Arr);
          opts.success(JSON.parse(str));
        }
      }
    }
  };
  if (opts.progress) {
    xhr.onprogress = function(e) {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
          opts.progress.innerHTML = (e.total / 1024).toFixed(2) + "KB";
        } else {
          opts.progress.innerHTML = ((e.loaded / e.total) * 100).toFixed(2) + "%";
        }
      }
    };
  }

  // if (opts.key.match("version") !== null || opts.key === "folder/list") {
  //   opts.key += "?v=" + Date.now();
  // }

  xhr.open("GET", url + opts.key, true);
  xhr.responseType = "arraybuffer"; // in firefox xhr.responseType must behind xhr.open
  xhr.send(null);
}

function upload(opts) {

  var token = opts.token ? opts.token : (opts.encrypt ? localStorage.token : publicKey);
  // opts.data can be ArrayBuffer or Uint8Array. strings will garbled characters.
  var uint8Arr = asmCrypto.AES_CBC.encrypt(opts.data, token);
  console.log("AES.encrypt");
  // new Blob([encList.buffer]) fast than new Blob([encList]) type不是必需的
  var blob = new Blob([uint8Arr.buffer], {
    type: 'application/octet-stream'
  });

  var formData = customForm(opts, blob);

  var xhr = new XMLHttpRequest();

  if (opts.progress) {
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        opts.progress.value = (e.loaded / e.total) * 100;
      }
    };
  }

  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        opts.success();
      }
    }
  };

  xhr.open("POST", url, true);
  xhr.send(formData);
}

function customForm(opts, blob) {
  var user = JSON.parse(localStorage.user);
  var AK = user.AK;
  var SK = user.SK;

  var policyJson = {
    "expiration": (new Date(Date.now() + 3600000)).toJSON(),
    "conditions": [
      // {
      //   "acl": "public-read"  // kss
      // },
      {
        "bucket": bucket
      },
      ["eq", "$key", opts.key]
    ]
  };
  // var policyJson = { // qn
  //   "scope": bucket + ":" + opts.key,
  //   "deadline": 3600 + Math.floor(Date.now() / 1000)
  // };
  var policy = btoa(JSON.stringify(policyJson));
  var signature = asmCrypto.HMAC_SHA1.base64(policy, SK);

  var formData = new FormData();
  // formData.append('token', AK + ':' + safe64(signature) + ':' + policy); // qn
  // formData.append('acl', "public-read"); // kss
  // formData.append('KSSAccessKeyId', AK); // kss
  formData.append('OSSAccessKeyId', AK); // oss
  formData.append('policy', policy);
  formData.append('signature', signature);

  if (opts.key.match("version") !== null || opts.key === "folder/list") { // oss
    formData.append('Cache-Control', 'no-cache');
  } else {
    formData.append('Cache-Control', 'public,max-age=8640000');
  }

  formData.append('key', opts.key);
  formData.append('file', blob); // 文件或文本内容，必须是表单中的最后一个域。

  return formData;
}

// function safe64(base64) { // qn
//   base64 = base64.replace(/\+/g, "-");
//   base64 = base64.replace(/\//g, "_");
//   return base64;
// };

function insertText(obj, str) {
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
}


//
// File Type Icons
//
function fileTypeIcons(type) {
  switch (type) {
    case "image/png":
    case "image/jpeg":
    case "image/vnd.microsoft.icon":
      return 'fa fa-file-image-o';
    case "application/x-xz":
    case "application/gzip":
    case "application/zip":
      return 'fa fa-file-archive-o';
    case "text/plain":
    case "text/x-markdown":
      return 'fa fa-file-text-o';
    case "application/pdf":
      return 'fa fa-file-pdf-o';
    case "application/msword":
    case "application/vnd.oasis.opendocument.text":
      return 'fa fa-file-word-o';
    default:
      return 'fa fa-file-o';
  }
}

function nDown(name, type, key, encrypt) {
  var progress = document.getElementById(key);

  ajaxArrayBuffer({
    key: key,
    encrypt: encrypt,
    uint8Arr: true,
    progress: progress,
    success: function(data) {
      var blob = new Blob([data.buffer], {
        "type": type
      });
      var objecturl = URL.createObjectURL(blob);

      // 生成下载
      var anchor = document.createElement("a");
      anchor.href = objecturl;
      anchor.download = name;
      document.body.appendChild(anchor);
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      anchor.dispatchEvent(evt);
      document.body.removeChild(anchor);

      progress.value = 0;
    }
  });
}

function timeDiff() {
  return Date.now() + '' + Math.floor(Math.random() * 9000 + 1000); // 或加入IP
}


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

/* UTF-8 array to DOMString and vice versa */

function UTF8ArrToStr(aBytes) {

  var sView = "";

  for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx];
    sView += String.fromCharCode(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
        /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
        (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
        : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
          (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
          : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
            (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
            : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
              (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
              : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
                (nPart - 192 << 6) + aBytes[++nIdx] - 128
                : /* nPart < 127 ? */ /* one byte */
                nPart
    );
  }

  return sView;

}

function strToUTF8Arr(sDOMStr) {

  var aBytes, nChr,
    nStrLen = sDOMStr.length,
    nArrLen = 0;

  /* mapping... */

  for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = sDOMStr.charCodeAt(nMapIdx);
    nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
  }

  aBytes = new Uint8Array(nArrLen);

  /* transcription... */

  for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
    nChr = sDOMStr.charCodeAt(nChrIdx);
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr;
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else /* if (nChr <= 0x7fffffff) */ {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30);
      aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    }
  }

  return aBytes;

}
