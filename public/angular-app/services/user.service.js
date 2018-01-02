angular.module('pokexchange').service('UserService',
function($http, $window, JWTService) {

  // Try to authenticate by registering or logging in
  this.attemptAuth = function(type, credentials) {
    // let route = (type === 'login') ? '/login' : '';
    let route = (type === 'login') ? '/signin' : '/signup'
    return $http({
      url: 'http://localhost:3000/api' + route, // + route
      method: 'POST',
      data: credentials
    }).then(
      // On success...
      (res) => {
        // // console.log('res')
        // // console.log(res)
        // console.log('res.data')
        // console.log(res.data)
        // console.log('created...')
        // // Set the JWT token
        // // saveUser(res.data.user)
        // $window.localStorage['user'] = JSON.stringify(res.data.user);
        // // JWTService.save(res.data.user.token);
        // console.log('User from Service')
        // console.log(res.data.user)
        // // Store the user's info for easy lookup
        // this.current = res.data.user;
        return res;
      }
    )
  }

  this.getUser = function() {
    return JSON.parse($window.localStorage['user']);
  }

  this.destroyUser = function() {
    $window.localStorage.removeItem('user');
  }

  this.logout = function() {
    return $http({
      url: 'http://localhost:3000/api/signout',
      method: 'GET'
    }).then(
      (res) => {
        return res
      }
    )
    // this.current = null;
    // JWTService.destroy();
    // // Do a hard reload of current state to ensure all data is flushed
    // this._$state.go(this.$state.$current, null, { reload: true });
  }

  // this.verifyAuth = function() {
  //   let deferred = this._$q.defer();
  //
  //   // Check for JWT token first
  //   if (!JWTService.get()) {
  //     deferred.resolve(false);
  //     return deferred.promise;
  //   }
  //
  //   // If there's a JWT & user is already set
  //   if (this.current) {
  //     deferred.resolve(true);
  //
  //   // If current user isn't set, get it from the server.
  //   // If server doesn't 401, set current user & resolve promise.
  //   } else {
  //     this._$http({
  //       url: 'localhost:3000' + '/user',
  //       method: 'GET'
  //     }).then(
  //       (res) => {
  //         this.current = res.data.user;
  //         deferred.resolve(true);
  //       },
  //       // If an error happens, that means the user's token was invalid.
  //       (err) => {
  //         JWTService.destroy();
  //         deferred.resolve(false);
  //       }
  //       // Reject automatically handled by auth interceptor
  //       // Will boot them to homepage
  //     );
  //   }
  //   return deferred.promise;
  // }

  // This method will be used by UI-Router resolves
  // this.ensureAuthIs= function(bool) {
  //   let deferred = this._$q.defer();
  //   this.verifyAuth().then((authValid) => {
  //     // if it's the opposite redirect home
  //     if (authValid !== bool) {
  //       this._$state.go('app.home');
  //       deferred.resolve(false);
  //     } else {
  //       deferred.resolve(true);
  //     }
  //   })
  //   return deferred.promise;
  // }

  // Update the current user's name, email, password, etc.
  this.updateUser = function(fields) {
    return $http({
      url: 'http://localhost:3000/api/users',
      method: 'PUT',
      data: { user: fields }
    }).then(
      (res) => {
        // console.log(res.data)
        // this.current = res.data.user;
        return res;
      }
    )
  }

  this.getUserInfoAndCards = function(userInfo) {
    return $http.post('http://localhost:3000/api/profile', userInfo)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }
});
