angular.module('showcaseApp.controllers.showcase',
['ngRoute', 'showcaseApp.services.github'])
.controller('ShowcaseController', [
  '$scope',
  '$location',
  'GithubService',

  function($scope, $location, GithubService) {
    $scope.loading = true;
    $scope.loadingError = false;

    $scope.userDetail = {
      avatarUrl: "",
      name: "",
      username: "",
      githubProfileUrl: ""
    }

    $scope.userRepositories = [];

    function populateReposForUser() {
      $scope.loading = true;
      GithubService.getReposByUsername($scope.form.username)
        .success(function(response) {
          console.log(response);
          $scope.userRepositories = response;
          $scope.loading = false;
          adjustColumnHeights();
        })
        .error(function(response) {
          console.log("error!");
          $scope.loading = false;
        });
    }

    function populateUserDetails() {
      GithubService.getUserDetails($scope.form.username)
        .success(function(response) {
          if (response.avatar_url)
            $scope.userDetail.avatarUrl = response.avatar_url;
          if (response.name)
            $scope.userDetail.name = response.name;
          if (response.login)
            $scope.userDetail.username = response.login;
          if (response.html_url)
            $scope.userDetail.githubProfileUrl = response.html_url;
          console.log(response);
        })
        .error(function(response) {
          console.log("error!");
          // Show error message: cannot find user
        });
    }

    function adjustColumnHeights() {
      angular.element(document).ready(function () {
        var heights = $(".thumbnail").map(function() {
            return $(this).height();
        }).get();

        maxHeight = Math.max.apply(null, heights);

        $(".thumbnail").height(maxHeight + 20);
      });
    }

    function setup() {
      var urlPath = $location.path().split("/");
      $scope.form.username = urlPath[urlPath.length - 1];
      console.log(urlPath);
      if (urlPath.length != 3 || !$scope.form.username) {
        $location.path('/');
        return;
      }

      populateUserDetails();
      populateReposForUser();
    };

    setup();
  }
])
