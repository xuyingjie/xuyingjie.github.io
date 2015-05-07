/**
 * - 存储为单文件（方便缓存、搜索）
 * - 存储文章和上传文件一样post
 * - 标题排序（字母排序，修改时间排序）
 * - 文件整体加密，云端存储格式(new Blob([ArrayBuffer]))
 * - scrollLoad with decrypt
 * - 多种文件格式的显示
 * - js文件合并压缩
 *
 * - es6
 * ! simplify function names
 * ! 用 for(var i = 0; i < a.length; i++) 取代 for(var i in a)
 */


// 返回登录前页面
var local = '#/';

// 异步缓存时 传递刷新条件
var refresh = false;

// Markdown
var md = window.markdownit({
  html: true,
  breaks: true,
  linkify: true
});


/*
 * ajax
 * or use Promise
 */
function ajaxArrayBuffer(opts) {
  'use strict';
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {

        var res = xhr.response;
        if (encrypt || opts.token) {
          var token = opts.token ? opts.token : localStorage.token;
          res = asmCrypto.AES_CBC.decrypt(xhr.response, token).buffer;
        }

        if (opts.arrayBuffer) {
          opts.success(res);
        } else {
          var str = utf8ArrToStr(new Uint8Array(res));
          opts.success(JSON.parse(str));
        }
      }
    }
  };
  if (opts.progress) {
    xhr.onprogress = function(e) {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
          // opts.progress.innerHTML = (e.total / 1024).toFixed(2) + 'KB';
          opts.progress.style.width = '0%';
        } else {
          // opts.progress.innerHTML = ((e.loaded / e.total) * 100).toFixed(2) + '%';
          opts.progress.style.width = ((e.loaded / e.total) * 100).toFixed(2) + '%';
        }
      }
    };
  }

  if (opts.key.match('version') !== null) {
    opts.key += '?v=' + Date.now();
  }

  xhr.open('GET', 'http://7teaz4.com1.z0.glb.clouddn.com/' + opts.key, true);

  // in firefox xhr.responseType must behind xhr.open
  xhr.responseType = 'arraybuffer';

  xhr.send(null);
}

function upload(opts) {
  'use strict';

  if (!opts.arrayBuffer) {
    opts.data = strToUTF8Arr(opts.data).buffer;
  }

  if (encrypt || opts.token) {
    var token = opts.token ? opts.token : localStorage.token;

    // opts.data can be ArrayBuffer or Uint8Array. strings will garbled characters.
    opts.data = asmCrypto.AES_CBC.encrypt(opts.data, token).buffer;
  }

  // new Blob([encList.buffer]) fast than new Blob([encList]) type不是必需的
  var blob = new Blob([opts.data]);

  var formData = customForm(opts, blob);

  var xhr = new XMLHttpRequest();

  if (opts.progress) {
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
         opts.progress.style.width = '0%';
       } else {
         opts.progress.style.width = ((e.loaded / e.total) * 100).toFixed(2) + '%';
       }
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

  xhr.open('POST', 'http://upload.qiniu.com', true);
  xhr.send(formData);
}

function customForm(opts, blob) {
  'use strict';

  var user = JSON.parse(localStorage.user);
  var AK = user.AK;
  var SK = user.SK;

  var policyJson = {
    'scope': bucket + ':' + opts.key,
    'deadline': 3600 + Math.floor(Date.now() / 1000)
  };
  var policy = btoa(JSON.stringify(policyJson));
  var signature = asmCrypto.HMAC_SHA1.base64(policy, SK);

  var formData = new FormData();
  formData.append('token', AK + ':' + safe64(signature) + ':' + policy);

  formData.append('key', opts.key);

  // 文件或文本内容，必须是表单中的最后一个域。
  formData.append('file', blob);

  return formData;
}

function safe64(base64) {
  base64 = base64.replace(/\+/g, '-');
  base64 = base64.replace(/\//g, '_');
  return base64;
}

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


/*
 * File Type Icons
 */
function fileTypeIcons(type) {
  switch (type) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/vnd.microsoft.icon':
      return 'fa fa-file-image-o';
    case 'application/x-xz':
    case 'application/gzip':
    case 'application/zip':
      return 'fa fa-file-archive-o';
    case 'text/plain':
    case 'text/x-markdown':
      return 'fa fa-file-text-o';
    case 'application/pdf':
      return 'fa fa-file-pdf-o';
    case 'application/msword':
    case 'application/vnd.oasis.opendocument.text':
      return 'fa fa-file-word-o';
    default:
      return 'fa fa-file-o';
  }
}

function successInfo(info) {
  'use strict';

  var div = document.createElement('div');
  div.innerHTML = `<div id="success-info">${info}</div>`;
  document.body.appendChild(div);

  var tick = setTimeout(function(){
    document.body.removeChild(div);
    clearTimeout(tick);
  }, 700);

  // var a = 1;
  // var tick = setInterval(function(){
  //   if (a > 0) {
  //     document.getElementById('success-info').style.backgroundColor = `rgba(86, 61, 124, ${a})`;
  //     // document.getElementById('success-info').style.backgroundColor = `rgba(0, 112, 149, ${a})`;
  //     a = a - 2;
  //   } else {
  //     clearInterval(tick);
  //     document.body.removeChild(div);
  //   }
  // }, 700);
}

function timeDiff() {
  return Date.now() + '' + Math.floor(Math.random() * 9000 + 1000); // 或加入IP
}

// function arrayBufferToStr(buf) {
//   'use strict';
//   return String.fromCharCode.apply(null, new Uint16Array(buf));
// }
//
// function strToArrayBuffer(str) {
//   'use strict';
//
//   var buf = new ArrayBuffer(str.length * 2);
//   var bufView = new Uint16Array(buf);
//   for (let i = 0, strLen = str.length; i < strLen; i++) {
//     bufView[i] = str.charCodeAt(i);
//   }
//   return buf;
// }


/*\
|*|
|*|  Base64 / binary data / UTF-8 strings utilities
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
|*|
|*|
|*| var Base64 = function(s){
|*|   var utf8 = strToUTF8Arr(s);
|*|   return base64EncArr(utf8);
|*| };
\*/

/* UTF-8 array to DOMString and vice versa */

function utf8ArrToStr(aBytes) {

  var sView = '';

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
