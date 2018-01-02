angular.module('pokexchange').controller('ProfileCtrl', ProfileCtrl);

function ProfileCtrl(UserService, CardService, $location, $scope, $rootScope, $mdToast) {
  var vm = this;

  $scope.view = 'profile'

  $scope.changeView = function(view) {
    $scope.view = view
  }

  $scope.displayProfile = function() {
    $location.path(`/profile/${$rootScope.currentUser.username}`)
  }

  vm.stateList = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME",
  "MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT",
  "VA","VI","VT","WA","WI","WV","WY"]

  vm.card = {
    name: "",
    description: "",
    price: undefined,
    picFile: undefined,
    tradable: false,
    owner: $rootScope.currentUser._id
  }

  vm.conditionValues = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

  CardService.getUserCards().then(
    (res) => {
      vm.cards = res.data.cards
      vm.pokemonList = res.data.pokemonList
    }
  )

  var user = angular.copy($rootScope.currentUser);
  vm.user = user
  vm.user.firstName = vm.user.firstName ? vm.user.firstName : ""
  vm.user.lastName = vm.user.lastName ? vm.user.lastName : ""
  vm.user.website = vm.user.website ? vm.user.website : ""
  vm.user.address = vm.user.address ? vm.user.address : ""
  vm.user.city = vm.user.city ? vm.user.city : ""
  vm.user.state = vm.user.state ? vm.user.state : ""
  vm.user.avatarUrl = vm.user.avatarUrl ? vm.user.avatarUrl: ""
  if (vm.user.avatarUrl == "") {
    vm.showGeneric = true
  } else {
    vm.showGeneric = false
    vm.avatar = vm.user.avatarUrl
  }
  // vm.user.username = $rootScope.currentUser.username

  var last = { bottom: false, top: true, left: false, right: true };

  $scope.toastPosition = angular.extend({}, last);

  $scope.getToastPosition = function() {
    sanitizePosition();

    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;

    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;

    last = angular.extend({},current);
  }

  vm.submit = function(form) {
    if (form.$valid) {
      UserService.updateUser(vm.user).then(
        (res) => {
          var pinTo = $scope.getToastPosition();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Profile Updated')
              .position(pinTo)
              .hideDelay(2000)
          );
          if (vm.user.avatarUrl) {
            vm.showGeneric = false
            vm.avatar = vm.user.avatarUrl
          }
          // console.log(res)
          // console.log(res.data.user)
          // $location.path('/profile')
          // $location.path('/herp')
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }

  vm.submitAdd = function(form) {
    if (form.$valid) {
      vm.card.types = vm.pokemonList[vm.pokemonList.findIndex(pokemon => pokemon.name == vm.card.name)].types
      CardService.addCard(vm.card).then(
        (res) => {
          var pinTo = $scope.getToastPosition();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Card Added')
              .position(pinTo)
              .hideDelay(2000)
          )
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }
}
