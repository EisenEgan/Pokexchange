angular.module('pokexchange')
.service('JWTService', function($window) {

  this.save = function(token) {
    $window.localStorage['jwtToken'] = token;
  }

  this.get = function() {
    return $window.localStorage['jwtToken'];
  }

  this.destroy = function() {
    $window.localStorage.removeItem('jwtToken');
  }
})
