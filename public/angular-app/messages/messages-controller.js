angular.module('pokexchange').controller('MessagesCtrl', MessagesCtrl);

function MessagesCtrl(MessageService, $location, $rootScope, $routeParams, $scope) {

  console.log('current user:')
  console.log($rootScope.currentUser._id)

  MessageService.getMessages({
    id: $rootScope.currentUser._id
  }).then(
    (res) => {
      var messages = res.data
      for (message of messages) {
        message.selected = false
      }
      $scope.messages = messages
    }
  )

  $scope.confirmed = false;
  $scope.change = function() {
    // console.log($scope.confirmed)
    $scope.messages.forEach((message) => {
      if ($scope.confirmed) {
        message.selected = true
      } else {
        message.selected = false
      }
    })
  }
  $scope.delete = function() {
    // Do on callback
    // $scope.messages = $scope.messages.filter((message) => {
    //   return !message.selected
    // })
    var messagesToDelete = []
    for (var message of $scope.messages) {
      if (message.selected)
        messagesToDelete.push(message._id)
    }
    var messagesObj = {
      messagesToDelete: messagesToDelete
    }
    MessageService.deleteMessages(messagesObj).then(
      (res) => {
        $scope.messages = $scope.messages.filter((message) => {
          return !message.selected
        })
      }, (err) => {
        console.log(err)
      }
    )
  }

  $scope.selectMessage = function(id) {
    $location.path('/message/' + id)
  }
}
