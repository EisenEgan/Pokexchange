angular.module('pokexchange').controller('OrderCtrl', OrderCtrl);

function OrderCtrl(OrderService, MessageService, $location, $scope, $rootScope, $routeParams) {

  var id = $routeParams.id,
      switched = false

  OrderService.getOrder(id).then(
    (res) => {
      var order = res.data
      if (order.type == 'Buy') {
        $scope.order = order
        if (order.buyer == $rootScope.currentUser._id) {
          $scope.btnMessage = "Contact Seller"
        } else {
          $scope.btnMessage = "Contact Buyer"
        }
      } else {
        if (order.buyer._id == $rootScope.currentUser._id) {
          switched = true
          var secondPersonCard = order.secondPersonCard
          order.secondPersonCard = order.firstPersonCard
          order.firstPersonCard = secondPersonCard
          var buyer = order.buyer
          order.buyer = order.seller
          order.seller = buyer
          $scope.order = order
        } else {
          $scope.order = order
        }
      }
    }
  )

  $scope.contact = function(order) {
    if (order.type == 'Buy') {
      if (order.buyer._id == $rootScope.currentUser._id) {
        MessageService.setRecipient(order.seller)
        MessageService.setSubject(`Re: Item ${order.firstPersonCard.name} (${order.firstPersonCard._id}).`)
      } else {
        MessageService.setRecipient(order.buyer)
        MessageService.setSubject(`Re: Item ${order.firstPersonCard.name} (${order.firstPersonCard._id})`)
      }
    } else {
      MessageService.setRecipient(order.buyer)
      MessageService.setSubject(`Re: Trade of your ${order.firstPersonCard.name} (${order.firstPersonCard._id}) for ${order.secondPersonCard.name} (${order.secondPersonCard._id}).`)
    }
    $location.path('/compose')
  }

}
