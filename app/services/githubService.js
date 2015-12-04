angular.module('showcaseApp.services.github', [])
.factory('GithubService', [
  '$http',
  '$q',

  function($http, $q) {
    var service = {
      getReposByUsername: function getReposByUsername(username) {
        var requestUrl = getRequestUrl('users/' + username + '/repos');
        return $http.get(requestUrl);
      },

      getUserDetails: function getUserDetails(username) {
        var requestUrl = getRequestUrl('users/' + username);
        return $http.get(requestUrl);
      },

      getLanguagesByRepo: function getLanguagesByRepo(owner, repo) {
        var requestUrl = getRequestUrl('/repos/' + owner + '/' + repo + '/languages');
        return $http.get(requestUrl);
      },

      getFollowersByUsername: function getFollowersByUsername(username) {
        var requestUrl = getRequestUrl('users/' + username + '/followers');
        return $http.get(requestUrl);
      }
    };

    function getRequestUrl(path) {
      return 'https://api.github.com/' + path;
    }

    return service;
  }
]);
