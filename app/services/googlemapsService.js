angular.module('showcaseApp.services.googlemaps', [])
.factory('GoogleMapsService', [
  '$http',
  '$q',

  function($http, $q) {
    var service = {
      getLocationByCity: function getLocationByCity(city) {
        var requestUrl = getRequestUrl(city);
        return $http.get(requestUrl);
      }
    };

    function getRequestUrl(path) {
      return 'https://maps.googleapis.com/maps/api/geocode/json?address=' + path + '&key=AIzaSyBLJVCW_fhxtE27EGvJNJM50b2lVt1vhgc';
    }

    return service;
  }
]);
