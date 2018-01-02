angular.module('pokexchange').controller('UserProfileCtrl', UserProfileCtrl);

function UserProfileCtrl(UserService, MessageService, $scope, $routeParams, $location, $rootScope) {

  var userInfo = {
    username: $routeParams.username
  }

  UserService.getUserInfoAndCards(userInfo).then(
    (res) => {
      if (res.data.success) {
        $scope.showProfile = true
        $scope.cards = res.data.cards
        $scope.user = res.data.user
        console.log(res.data)
        if ($rootScope.currentUser && $rootScope.currentUser._id == $scope.user._id) {
          $scope.showLink = true
        }
      } else {
        $scope.showProfile = false
      }
    }
  )

  $scope.profileClicked = function(userInfo) {
    MessageService.setRecipient(userInfo)
    MessageService.setSubject("")
    $location.path('/compose')
  }
}
