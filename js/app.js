var app = angular.module('app', ['ngRoute']);
var url = '/';

// app.config(function($httpProvider) {
//   if (window.localStorage.name && window.localStorage.token) {
//     $httpProvider.defaults.headers.post.Name = window.localStorage.name;
//     $httpProvider.defaults.headers.post.Token = window.localStorage.token;
//   }
// });

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/t/:id', {
      templateUrl: 'views/section.html',
      controller: 'SectionController'
    })
    .when('/s/:keyword', {
      templateUrl: 'views/section.html',
      controller: 'SectionController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })
    .when('/a', {
      templateUrl: 'views/editor.html',
      controller: 'PutController'
    })
    .when('/e/:id', {
      templateUrl: 'views/editor.html',
      controller: 'PutController'
    });

}]);

app.controller('NavController', function($scope, $rootScope, $http, $window, $location, $routeParams) {
  $scope.mainput = '';
  $rootScope.auth = false;
  $rootScope.path = '/';

  $scope.search = function() {
    var input = $scope.mainput;

    if (input === '') {
      $location.path('/');
    } else {
      $location.path('/s/' + input);
    }
  };

  $scope.login = function() {
    $rootScope.path = $location.path();
    $location.path('/login');
  };

  $scope.logout = function() {
    $http.post(url + "logout").success(
      function(data) {
        if (data) {
          $window.localStorage.token = 0;
          $rootScope.auth = false;
        }
      }
    );
  };

  (function auth() {
    $http.post(url + 'auth').success(
      function(data) {
        if (data) {
          $rootScope.auth = true;
          // $scope.commit = data;
        } else {
          $rootScope.auth = false;
        }
      }
    );
  })();

});

app.controller('HomeController', function($scope, $http, $window, $location, $routeParams, aws) {
  $scope.title = [];

  (function init() {


    $http.jsonp("http://dbmy.oss-cn-beijing.aliyuncs.com/dbmy.json?callback=JSON_CALLBACK").success(function(data){
      console.log(data);
    });





    // $scope.title = aws.list();
    // console.log($scope.title);


    // $http.post(url + 'index', {
    //   title: 1
    // }).success(
    //   function(data) {
    //     $scope.title = data;
    //   }
    // );
  })();

});

app.controller('SectionController', function($scope, $rootScope, $http, $window, $location, $routeParams) {
  $scope.fragment = [];

  $scope.init = function(data) {
    $http.post(url + 'get', data).success(
      function(data) {
        $scope.fragment = data;
      }
    );
  };

  $scope.e = function(id) {
    $rootScope.path = $location.path();
    $location.path('/e/' + id);
  };

  if ($routeParams.id) {
    data = {
      id: $routeParams.id,
      keyword: ''
    };
    $scope.init(data);
  } else if ($routeParams.keyword) {
    $scope.mainput = $routeParams.keyword;
    data = {
      id: '',
      keyword: $routeParams.keyword
    };
    $scope.init(data);
  }

});

app.controller('LoginController', function($scope, $rootScope, $http, $window, $location) {

  $scope.name = '';
  $scope.passwd = '';

  $scope.login = function() {
    if ($scope.name !== '' && $scope.passwd !== '') {

      var name = String(CryptoJS.SHA256($scope.name));
      var passwd = String(CryptoJS.SHA256($scope.passwd));

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

      // var encrypted = CryptoJS.AES.encrypt("", $scope.passwd);
      // console.log(encrypted);

      $http.jsonp("http://dbmy.oss-cn-beijing.aliyuncs.com/etc/"+ name +"?callback=JSON_CALLBACK").success(function(data){
        if (data.passwd == passwd){
          var decrypted = CryptoJS.AES.decrypt(data.token, $scope.passwd, { format: JsonFormatter });
          var token = decrypted.toString(CryptoJS.enc.Utf8);
          console.log("token: "+token);

          // 存储到 IndexedDB
          // $http.defaults.headers.post.Token = token;
        }
      });



      //
      // $http.post(url + "login", {
      //   name: $scope.name,
      //   passwd: $scope.passwd
      // }).success(
      //   function(data) {
      //     if (data) {
      //       // $window.localStorage.name = $scope.name;
      //       // $window.localStorage.token = data.token;
      //       // $http.defaults.headers.post.Name = $scope.name;
      //       // $http.defaults.headers.post.Token = data.token;
      //       $rootScope.auth = true;
      //       // console.log($rootScope.path);
      //       if ($rootScope.path) {
      //         $location.path($rootScope.path).replace();
      //       } else {
      //         $location.path('/').replace();
      //       }
      //     }
      //   }
      // );

      $scope.passwd = '';
    }
  };
});

app.controller('PutController', function($scope, $rootScope, $http, $location, $routeParams, aws) {

  $scope.id = '';
  $scope.title = '';
  $scope.content = ''; // or undefined

  // (function init() {
  //   if ($routeParams.id){
  //     $http.post(url + 'get', {
  //       id: $routeParams.id
  //     }).success(
  //       function(data) {
  //         if (data) {
  //           $scope.title = data[0].title;
  //           $scope.content = data[0].content;
  //           $scope.id = data[0].id;
  //         } else {
  //           $location.path($rootScope.path).replace();
  //         }
  //       }
  //     );
  //   }
  // })();

  $scope.save = function() {
    if ($scope.title !== '') {
      var data = {
        title: $scope.title,
        content: $scope.content,
        id: $scope.id
      };
      var a = aws.put(data);
      console.log(a);
      // $http.post(url + "put", data).success(
      //   function(data) {
      //     if (data) {
      //       $location.path('/t/' + data.id).replace();
      //       $scope.id = '';
      //       $scope.title = '';
      //       $scope.content = '';
      //     }
      //   }
      // );
    }
  };

  var form = document.forms.namedItem("fileinfo");

  form.addEventListener('submit', function(ev) {
    var oData = new FormData(document.forms.namedItem("fileinfo"));
    var progress = document.getElementById('uploadprogress');
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "upload", true);
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        var complete = (event.loaded / event.total * 100 | 0);
        progress.value = progress.innerHTML = complete;
      }
    };
    xhr.onload = function(oEvent) {
      if (xhr.status == 200) {
        var c = xhr.responseText;

        $scope.content = $scope.content + c;
        var textarea = document.getElementById('content');
        insertText(textarea, c);

        document.getElementById("file").value = "";
        progress.value = 0;
      }
    };
    xhr.send(oData);
    ev.preventDefault();
  }, false);

  function insertText(obj,str) {
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

});

app.factory('aws', function(){
  AWS.config.update({accessKeyId: 'AKIAJDGCHDGQB55A7Z7Q', secretAccessKey: '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'});
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


app.filter('markdown', function() {
  var converter = new Showdown.converter();
  return function(input) {
    return converter.makeHtml(input || '');
  };
});

// 有Bug
// app.filter('highlight', function($sce) {
//   return function(input, s) {
//     if (s.length > 1) {
//       var re = new RegExp("(" + s + ")", "gi");
//       return $sce.trustAsHtml(input.replace(re, '<span class="search">$1</span>'));
//     } else { // undefined or ''
//       return $sce.trustAsHtml(input);
//     }
//   };
// });

app.filter('trustAsHtml', function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  };
});
