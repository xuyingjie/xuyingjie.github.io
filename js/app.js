var app = angular.module('app', ['ngRoute', 'crypto', 'indexed', 'oss']);
var url = 'http://dbmy.oss-cn-beijing.aliyuncs.com/';
var publicKey = 'FrtVDIUvAik';

app.config(function($httpProvider) {
  if (window.localStorage.token) {
    $httpProvider.defaults.headers.post.Token = window.localStorage.token;
  }
});

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

app.controller('NavController', function($scope, $rootScope, $http, $window, $location, $routeParams, crypto, indexed) {
  $scope.mainput = '';
  $rootScope.auth = false;
  $rootScope.path = '/';

  $rootScope.title = [];
  $rootScope.version = 0;
  $rootScope.set = [];
  $rootScope.setEnc = [];

  (function init() {
    var cache = function(){
      $http.get(url + "set/" + $rootScope.version).success(function(response){
        $rootScope.setEnc = response.set;
        response.set.forEach(function(x){
          var d = {
            title: crypto.decrypt(x.title, publicKey),
            id: x.id
          };
          $rootScope.title.push(d);
          d.content = crypto.decrypt(x.content, publicKey);
          $rootScope.set.push(d);
          indexed.put(d, 'section');
        });

        indexed.put({"id": "version", "version": $rootScope.version}, 'etc');
        indexed.put({"id": $rootScope.version, "title": $rootScope.title}, 'title');
        indexed.put({"id": $rootScope.version, "set": $rootScope.set}, 'set');
        indexed.put({"id": $rootScope.version, "set": $rootScope.setEnc}, 'setEnc');
      });
    };

    $http.get(url + "version", {cache: false}).success(function(res){
      $rootScope.version = res.version;

      indexed.get("version", 'etc')
        .then(function(r) {
          if (r) {
            if (r.version === res.version){
              console.log("EEE");
              indexed.get(r.version, 'title').then(function(r){
                $rootScope.title = r.title;   // if(r)
              });
              indexed.get(r.version, 'set').then(function(r){
                $rootScope.set = r.set;
              });
              indexed.get(r.version, 'setEnc').then(function(r){
                $rootScope.setEnc = r.set;
              });
            } else {
              cache();
            }
          } else {
            cache();
          }
        }
      );
    });
  })();


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
    $window.localStorage.removeItem("token");
    $rootScope.auth = false;
  };

  if ($window.localStorage.token) {
    $rootScope.auth = true;
  } else {
    $rootScope.auth = false;
  }
});

app.controller('HomeController', function($scope, $rootScope, $http, crypto, indexed) {

});

app.controller('SectionController', function($scope, $rootScope, $http, $window, $location, $routeParams, crypto, indexed) {
  $scope.fragment = [];
  $scope.query = '';

  $scope.init = function(id) {
    indexed.get($routeParams.id, 'section').then(function(x){
      $scope.fragment = [x];
    });
  };

  $scope.e = function(id) {
    $rootScope.path = $location.path();
    $location.path('/e/' + id);
  };

  if ($routeParams.id) {
    $scope.init($routeParams.id);
  } else if ($routeParams.keyword) {
    $scope.query = $routeParams.keyword;
    $scope.fragment = $rootScope.set;
  }

});

app.controller('LoginController', function($scope, $rootScope, $http, $window, $location, crypto) {

  $scope.name = '';
  $scope.passwd = '';

  $scope.login = function() {
    if ($scope.name !== '' && $scope.passwd !== '') {

      var name = crypto.SHA256($scope.name);
      var passwd = crypto.SHA256($scope.passwd);

      $http.get("https://dbmy.oss-cn-beijing.aliyuncs.com/etc/" + name)
        .success(function(data) {
          console.log(data);
          if (data.passwd == passwd) {
            var token = crypto.decrypt(data.token, $scope.passwd);
            var tokenSHA = crypto.SHA256(token);

            $http.defaults.headers.post.Token = tokenSHA;
            $window.localStorage.token = tokenSHA;

            $rootScope.auth = true;
            if ($rootScope.path) {
              $location.path($rootScope.path).replace();
            } else {
              $location.path('/').replace();
            }
            $scope.passwd = '';
          }
        });

    }
  };
});

app.controller('PutController', function($scope, $rootScope, $http, $location, $routeParams, crypto, indexed, oss) {

  $scope.id = '';
  $scope.title = '';
  $scope.content = ''; // or undefined

  if ($routeParams.id) {
    indexed.get($routeParams.id, 'section').then(function(x){
      $scope.title = x.title;
      $scope.content = x.content;
      $scope.id = x.id;
    });
  }

  $scope.save = function() {
    if ($scope.title !== '') {

      $rootScope.version++;
      var version = {
        "version": $rootScope.version
      };
      var set = {
        "set": $rootScope.setEnc
      };

      var d = {
        title: $scope.title,
        id: $scope.id
      };
      var data = {
        title: crypto.encrypt($scope.title, publicKey),
        content: crypto.encrypt($scope.content, publicKey),
        id: $scope.id
      };

      if (data.id === '') {
        data.id = crypto.timeDiff();
        set.set.push(data);

        d.id = data.id;
        $rootScope.title.push(d);
        d.content = $scope.content;
        $rootScope.set.push(d);
      } else {
        for (var i in set.set) {
          if (data.id == set.set[i].id) {
            set.set[i] = data;

            $rootScope.title[i] = d;
            d.content = $scope.content;
            $rootScope.set[i] = d;
          }
        }
      }

      $rootScope.setEnc = set.set;
      indexed.put(d, 'section');
      indexed.put({"id": "version", "version": $rootScope.version}, 'etc');

      // Bug
      // indexed.put({"id": $rootScope.version, "title": $rootScope.title}, 'title');
      indexed.put({"id": $rootScope.version, "set": $rootScope.set}, 'set');
      indexed.put({"id": $rootScope.version, "set": $rootScope.setEnc}, 'setEnc');

      var file = new Blob([JSON.stringify(set)], {"type": "text\/json"});
      var key = "set/" + version.version;
      var progress = document.getElementById('save-progress');  // 页面顶部的进度线

      var xhr = oss.upload(file, key, progress);

      xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

          var file = new Blob([JSON.stringify(version)], {"type": "text\/json"});
          var key = "version";

          var xhr0 = oss.upload(file, key, progress);
          xhr0.onload = function() {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
              console.log("hello");
              $location.path('/t/' + $scope.id).replace();
              // $location.path('/');

              $scope.id = '';
              $scope.title = '';
              $scope.content = '';
            }
          };
        }
      };

    }
  };

  $scope.uploadFile = function() {
    var file = document.getElementById('file').files[0];
    var key = "u/" + crypto.timeDiff() + "_" + file.name;
    var progress = document.getElementById('upload-progress');

    var xhr = oss.upload(file, key, progress);

    xhr.onload = function() {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        var c = "\n![](" + url + key + ")";

        $scope.content = $scope.content + c;
        var textarea = document.getElementById('content');
        insertText(textarea, c);

        document.getElementById("file").value = "";
        progress.value = 0;
      }
    };
  };

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

});


//
//
//
app.filter('decrypt', function(crypto) {
  return function(input) {
    return crypto.decrypt(input, publicKey);
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
