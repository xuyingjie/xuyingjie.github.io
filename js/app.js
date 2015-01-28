// 分开 app.factory
// php server end
// indexedDB.list(), indexedDB.get()
//



var app = angular.module('app', ['ngRoute', 'crypto']);
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

app.controller('LoginController', function($scope, $rootScope, $http, $window, $location, crypto) {

  $scope.name = '';
  $scope.passwd = '';

  $scope.login = function() {
    if ($scope.name !== '' && $scope.passwd !== '') {

      var name = crypto.SHA256($scope.name);
      var passwd = crypto.SHA256($scope.passwd);

      // var encrypted = crypto.encrypt("sdfasdf", $scope.passwd);
      // console.log(encrypted);

      $http.jsonp("http://dbmy.oss-cn-beijing.aliyuncs.com/etc/"+ name +"?callback=JSON_CALLBACK")
        .success(function(data){
          if (data.passwd == passwd){
            var token = crypto.decrypt(data.token, $scope.passwd);
            console.log("token: "+token);

            // 存储到 IndexedDB
            // $http.defaults.headers.post.Token = token;

        //       $rootScope.auth = true;
        //       if ($rootScope.path) {
        //         $location.path($rootScope.path).replace();
        //       } else {
        //         $location.path('/').replace();
        //       }
          }
        }).error(function(data, err){
          console.log("err: "+err);
          console.log("b: "+data);
        });

      // $scope.passwd = '';
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
