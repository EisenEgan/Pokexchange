angular.module('pokexchange').controller('ComposeCtrl', ComposeCtrl);

function ComposeCtrl(MessageService, $location, $scope, $rootScope) {

  $scope.recipient = MessageService.getRecipient()

  $scope.message = {
    message: ""
  }

  $scope.message.subject = MessageService.getSubject()

  $scope.submit = function(form) {
    if (form.$valid) {
      var messageObj = {
        sender: $rootScope.currentUser._id,
        recipient: $scope.recipient._id,
        subject: $scope.message.subject,
        message: $scope.message.message
      }

      MessageService.sendMessage(messageObj).then(
        (res) => {
          $location.path('/profile')
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }
}
