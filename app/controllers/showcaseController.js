angular.module('showcaseApp.controllers.showcase',
['ngRoute', 'showcaseApp.services.github'])
.controller('ShowcaseController', [
  '$scope',
  '$location',
  'GithubService',

  function($scope, $location, GithubService) {
    $scope.loading = true;
    $scope.loadingError = false;

    function populateReposForUser() {
      $scope.loading = true;
      GithubService.getReposByUsername($scope.form.username)
        .success(function(response) {
          console.log(response);
          $scope.loading = false;
        })
        .error(function(response) {
          console.log("error!");
          $scope.loading = false;
        });
    }

    function setup() {
      if (!$scope.form.username) {
        $location.path('/');
        return;
      }

      populateReposForUser();
    };

    setup();
  }
]);
