angular.module('showcaseApp.controllers.main', ['ngRoute'])
.controller('MainController', function($scope, $location, $route) {
  $scope.form = {
    username: ""
  };

  $scope.showcaseUser = function() {
    if ($scope.form.username) {
      $location.path('/showcase/' + $scope.form.username);
    }
  };
});
