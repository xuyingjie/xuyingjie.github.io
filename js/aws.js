angular.module('aws', [])
.factory('aws', function(){
  AWS.config.update({accessKeyId: '', secretAccessKey: ''});
  AWS.config.region = 'ap-southeast-1';
  var s3 = new AWS.S3();

  var getlist = function(){
    var keyStr = [];
    var params = {Bucket: 'xuyingjie'};
    s3.listObjects(params, function(err, data){
      if (err) {
        return [err, err.stack];
      } else {
        data.Contents.forEach(function(i){
          var k = i.Key;
          // var t = k.substring(k.indexOf("_")+1, k.length);
          // console.log(k);
          // console.log(k.substring(k.indexOf("_")+1, k.length));
          var t = k;
          var a = {
            key: k,
            title: t
          };
          keyStr.push(a);
        });
        console.log(keyStr);
        return keyStr;
      }
    });
  };

  return {
    list: function(){
      return getlist();
    },

    put: function(c){
      var params = {
        Bucket: 'xuyingjie',
        Key: Date.now() + '_' + c.title,
        Body: c.content
      };
      s3.putObject(params, function(err, data){
        if (err) return err;
        else     return data;
      });
    }

  };
});
