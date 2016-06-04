angular.module('showcaseApp.controllers.showcase', [
  'ngRoute',
  'showcaseApp.services.github'
])
.controller('ShowcaseController', [
  '$scope',
  '$location',
  'GithubService',

  function($scope, $location, GithubService) {
    var locationCount = 0;
    $scope.loading = true;
    $scope.loadingError = false;

    $scope.userDetail = {
      avatarUrl: "",
      name: "",
      username: "",
      githubProfileUrl: "",
      repoCount: 0,
      starCount: 0,
      followerCount: 0
    }

    $scope.userRepositories = [];

    function populateReposForUser() {
      $scope.loading = true;
      GithubService.getReposByUsername($scope.form.username)
        .success(function(response) {
          // console.log(response);
          // Calculate repo details
          var repoCount = 0;
          var starCount = 0;
          for (var i = 0; i < response.length; i++) {
            var repo = response[i];
            repoCount++;
            starCount += parseInt(repo.stargazers_count);
          }
          $scope.userDetail.repoCount = repoCount;
          $scope.userDetail.starCount = starCount;

          $scope.userRepositories = response;
          $scope.loading = false;
          adjustColumnHeights();
        })
        .error(function(response) {
          console.log("Problem loading user repo!");
          $scope.loading = false;
          $scope.loadingError = true;
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
          if (response.followers)
            $scope.userDetail.followerCount = response.followers;
          // console.log(response);
        })
        .error(function(response) {
          console.log("User not found!");
          console.log(response);
          $scope.loadingError = true;
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
