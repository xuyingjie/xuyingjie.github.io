// 分开 app.factory
// php server end
// indexedDB.list(), indexedDB.get()
//
// 多人实时操作冲突
// ???React.js


// var Dbmy;
// var JSONP = function(url, callback) {
//   var script = document.createElement("script");
//   Dbmy = function(response){
//     try {
//       callback(response);
//     }
//     finally {
//       script.parentNode.removeChild(script);
//     }
//   };
//   script.src = url;
//   document.body.appendChild(script);
// };

var app = angular.module('app', ['ngRoute', 'crypto', 'indexed']);
var url = '/';
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

app.controller('NavController', function($scope, $rootScope, $http, $window, $location, $routeParams, indexed) {
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
    $window.localStorage.removeItem("token");
    $rootScope.auth = false;
  };

  if ($window.localStorage.token) {
    $rootScope.auth = true;
  } else {
    $rootScope.auth = false;
  }

  //
  // indexed.get('1423114473853_59', 't')
  //   .then(function(response){
  //     console.log(response);
  //     $scope.mainput = 'sdfsdf';
  //   });

});

app.controller('HomeController', function($scope, $http, indexed) {
  $scope.title = [];

  (function init() {
    $http.get("http://dbmy.oss-cn-beijing.aliyuncs.com/etc/dbmy", {
      cache: false
    })
      .success(function(data) {
        // var keyStr = [];
        // data.keys.forEach(function(i) {
        //   console.log(i);
        //   var t = k.substring(k.indexOf("_")+1, k.length);
        //   var a = {
        //     key: i,
        //     title: t
        //   };
        //   keyStr.push(a);
        // });
        $scope.title = data.with;
        indexed.put(data, 'etc');
      });
  })();
});

app.controller('SectionController', function($scope, $rootScope, $http, $window, $location, $routeParams, indexed) {
  $scope.fragment = [];

  $scope.init = function(id) {
    indexed.get(id, 't')
      .then(function(response) {
        if (response) {
          $scope.fragment = [response];
        } else {
          $http.get("http://dbmy.oss-cn-beijing.aliyuncs.com/t/" + id)
            .success(function(res) {
              indexed.put(res, 't');
              $scope.fragment = [res];
            });
        }
      });
  };

  $scope.e = function(id) {
    $rootScope.path = $location.path();
    $location.path('/e/' + id);
  };

  if ($routeParams.id) {
    $scope.init($routeParams.id);
  } else if ($routeParams.keyword) {
    $scope.mainput = $routeParams.keyword;
    data = {
      id: '',
      keyword: $routeParams.keyword
    };
    $scope.init(data);
  }

});

app.controller('LoginController', function($scope, $rootScope, $http, $window, $location, crypto) {

  $scope.name = '';
  $scope.passwd = '';

  $scope.login = function() {
    if ($scope.name !== '' && $scope.passwd !== '') {

      var name = crypto.SHA256($scope.name);
      var passwd = crypto.SHA256($scope.passwd);

      $http.get("http://dbmy.oss-cn-beijing.aliyuncs.com/etc/" + name)
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

app.controller('PutController', function($scope, $rootScope, $http, $location, $routeParams, crypto, indexed) {

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
      var title = crypto.encrypt($scope.title, publicKey);
      var content = crypto.encrypt($scope.content, publicKey);
      if ($scope.id === '') {
        $scope.id = crypto.timeDiff();
      }
      var data = {
        title: title,
        content: content,
        id: $scope.id
      };

      $http.post("http://dbmy.sinaapp.com/put.php", data).success(function(response) {
        if (response) {
          indexed.put(data, 't');

          $http.get("http://dbmy.oss-cn-beijing.aliyuncs.com/etc/dbmy")
            .success(function(res) {
              res.version += 1;
              var add = {
                title: title,
                id: $scope.id
              };
              res.with.push(add);

              $http.post("http://dbmy.sinaapp.com/put.php", res).success(function(resp) {
                if (resp) {
                  indexed.put(res, 'etc');
                  $location.path('/t/' + $scope.id).replace();
                  $scope.id = '';
                  $scope.title = '';
                  $scope.content = '';
                }
              });
            });
        }
      }
      );
    }
  };

  var form = document.forms.namedItem("fileinfo");

  form.addEventListener('submit', function(ev) {
    var oData = new FormData(document.forms.namedItem("fileinfo"));
    var progress = document.getElementById('uploadprogress');
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "upload", true);
    xhr.upload.onprogress = function(event) {
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
