angular.module('oss', ['crypto'])
  .factory('oss', function(crypto) {

    // Doc: http://docs.aliyun.com/?spm=5176.383663.9.2.SROF85#/oss/api-reference/object&PostObject
    var upload = function(file, key, progress) {

      var OSSAccessKeyId = "";
      var OSSAccessKeySecret = "";

      var policyJson = {
        "expiration": "2024-12-01T12:00:00.000Z",
        "conditions": [
          {
            "bucket": 'dbmy'
          }
        ]
      };

      var policy = crypto.Base64(JSON.stringify(policyJson));
      var signature = CryptoJS.HmacSHA1(policy, OSSAccessKeySecret).toString(CryptoJS.enc.Base64);

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

    return {
      upload: function(file, key, progress) {
        return upload(file, key, progress);
      }
    };

  });
