angular.module('showcaseApp', [
  'ngRoute',
  'showcaseApp.controllers.main',
  'showcaseApp.controllers.showcase'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/main.html'
    })
    .when('/showcase/:username', {
      templateUrl: '/templates/showcase.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  }
]);
