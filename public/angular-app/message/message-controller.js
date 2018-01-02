angular.module('pokexchange').controller('MessageCtrl', MessageCtrl);

function MessageCtrl(MessageService, OrderService, $location, $rootScope, $routeParams) {

  var vm = this

  var id = $routeParams.id

  MessageService.getMessage(id).then(
    (res) => {
      vm.message = res.data
    }
  )

  vm.acceptOffer = function() {
    offerObj = {
      orderId: vm.message.order,
      messageId: vm.message._id
    }
    OrderService.acceptOffer(offerObj).then(
      (res) => {
        $location.path('/messages')
      }
    )
  }

  vm.rejectOffer = function() {
    offerObj = {
      orderId: vm.message.order,
      messageId: vm.message._id
    }
    OrderService.rejectOffer(offerObj).then(
      (res) => {
        $location.path('/messages')
      }
    )
  }
}
