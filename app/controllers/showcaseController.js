angular.module('showcaseApp.controllers.showcase', [
  'ngRoute',
  'showcaseApp.services.github',
  'showcaseApp.services.googlemaps'
])
.controller('ShowcaseController', [
  '$scope',
  '$location',
  'GithubService',
  'GoogleMapsService',

  function($scope, $location, GithubService, GoogleMapsService) {
    var locationCount = 0;
    $scope.loading = true;
    $scope.loadingError = false;

    $scope.userDetail = {
      avatarUrl: "",
      name: "",
      username: "",
      githubProfileUrl: "",
      repoCount: 0,
      starCount: 0
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

    function showFollowersMap() {
      angular.element(document).ready(function () {
        $("#map-container").mapael({
          map: {
            name: "world_countries"
          }
        });
      });
    }

    function populateMapWithFollowers() {
      $scope.loading = true;
      GithubService.getFollowersByUsername($scope.form.username)
        .success(function(response) {
          var followerCount = 0;
          var followerUsernames = [];
          for (var i = 0; i < response.length; i++) {
            var follower = response[i];
            followerUsernames.push(follower.login);
            followerCount++;
          }
          getUserLocationAndUpdateMap(followerUsernames);
        })
        .error(function(response) {
          console.log("Problem loading user followers!");
          $scope.loading = false;
          $scope.loadingError = true;
        });
    }

    function getUserLocationAndUpdateMap(followerUsernames) {
      for (var i = 0; i < followerUsernames.length; i++) {
        var followerUsername = followerUsernames[i];
        GithubService.getUserDetails(followerUsername)
          .success(function(response) {
            updateMapWithCity(response.location);
          })
          .error(function(response) {
            console.log("Problem loading user location!");
          });
      }
    }

    function updateMapWithCity(city) {
      GoogleMapsService.getLocationByCity(city)
        .success(function(response) {
          if (response.results[0]) {
            var currLocation = response.results[0].geometry.location;
            var newPlots = {};
            newPlots["dummyLocation" + locationCount] = {
              latitude: currLocation.lat,
              longitude: currLocation.lng
            };
            locationCount += 1;
            $("#map-container").trigger('update', [{}, newPlots, {}, {}]);
            console.log(currLocation.lat + ", " + currLocation.lng);
          }
        })
        .error(function(response) {
          console.log("Location not found!");
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
      showFollowersMap();
      populateMapWithFollowers();
    };

    setup();
  }
])
