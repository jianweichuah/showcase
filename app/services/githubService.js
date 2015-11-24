angular.module('showcaseApp.services.github', [])
.factory('GithubService', [
  '$http',
  '$q',

  function($http, $q) {
    var service = {
      getReposByUsername: function getReposByUsername(username) {
        var requestUrl = getRequestUrl(username + '/repos');
        return $http.get(requestUrl);
      },

      getUserDetails: function getUserDetails(username) {
        var requestUrl = getRequestUrl(username);
        return $http.get(requestUrl);
      }
    };

    function getRequestUrl(path) {
      return 'https://api.github.com/users/' + path;
    }

    return service;
  }
]);
