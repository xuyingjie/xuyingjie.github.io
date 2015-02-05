// Documents: https://code.google.com/p/crypto-js/

angular.module('crypto', [])
.factory('crypto', function(){

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

  return {
    timeDiff: function(){
      return Date.now() + '' + Math.floor(Math.random() * 9000 + 1000); // 或加入IP
    },
    SHA256: function(s){
      return String(CryptoJS.SHA256(s));
    },
    encrypt: function(s, passwd){
      var encrypted = CryptoJS.AES.encrypt(s, passwd, { format: JsonFormatter });
      return String(encrypted);
    },
    decrypt: function(s, passwd){
      var decrypted = CryptoJS.AES.decrypt(s, passwd, { format: JsonFormatter });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
  };
});
