angular.module('pokexchange', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngSanitize', 'ngFileUpload', 'ngAnimate', 'ui.router']).config(config);

// $stateProvider allows for multiple views, allowing for navbar and content to be displayed differently

function config($routeProvider, $locationProvider, $mdIconProvider, $$mdSvgRegistry, $mdThemingProvider) {
  $locationProvider.html5Mode(true)
  $routeProvider
    .when('/', {
      templateUrl: 'angular-app/login/login.html',
      controller: LoginCtrl,
      controllerAs: 'vm'
    })
    .when('/profile', {
      templateUrl: 'angular-app/profile/profile.html',
      controller: ProfileCtrl,
      controllerAs: 'vm',
      resolve: {
        logincheck: checkLoggedin
      }
    })
    .when('/profile/:username', {
      templateUrl: 'angular-app/user-profile/user-profile.html',
      controller: UserProfileCtrl,
      controllerAs: 'vm'
    })
    .when('/search', {
      templateUrl: 'angular-app/search/search.html',
      controller: SearchCtrl,
      controllerAs: 'vm'
    })
    .when('/card/:id', {
      templateUrl: 'angular-app/details/details.html',
      controller: DetailsCtrl,
      controllerAs: 'vm'
    })
    .when('/trade', {
      templateUrl: 'angular-app/trade/trade.html',
      controller: TradeCtrl,
      controllerAs: 'vm',
      resolve: {
        logincheck: checkLoggedin
      }
    })
    .when('/message/:id', {
      templateUrl: 'angular-app/message/message.html',
      controller: MessageCtrl,
      controllerAs: 'vm'
    })
    .when('/messages', {
      templateUrl: 'angular-app/messages/messages.html',
      controller: MessagesCtrl,
      controllerAs: 'vm'
    })
    .when('/orders', {
      templateUrl: 'angular-app/orders/orders.html',
      controller: OrdersCtrl,
      controllerAs: 'vm'
    })
    .when('/order/:id', {
      templateUrl: 'angular-app/order/order.html',
      controller: OrderCtrl,
      controllerAs: 'vm'
    })
    .when('/compose', {
      templateUrl: 'angular-app/compose/compose.html',
      controller: ComposeCtrl,
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/'
    })
  //

  $mdIconProvider
    .icon('md-close', $$mdSvgRegistry.mdClose)

  $mdThemingProvider
    .theme('docs-dark', 'default')
    .primaryPalette('blue')
    .dark();

  // var redTheme = $mdThemingProvider.theme('redTheme', 'default');
  // var redPalette = $mdThemingProvider.extendPalette('red', {
  //   '500': '#ED1C24'
  // });
  // $mdThemingProvider
  //   .definePalette('redPalette', redPalette)
  //   .theme('docs-dark', 'default')
  //   .dark()
  //   redTheme.primaryPalette('redPalette');
}

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
  var deferred = $q.defer();
  $http.get('/api/loggedin').then(function(user) {
    // $rootScope.errorMessage = null;
    //User is Authenticated
    if (user && user.data !== '0') {
      $rootScope.currentUser = user.data;
      deferred.resolve();
    } else { //User is not Authenticated
      // $rootScope.errorMessage = 'You need to log in.';
      deferred.reject();
      $location.url('/');
    }
  });
  return deferred.promise;
}
