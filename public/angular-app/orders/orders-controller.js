angular.module('pokexchange').controller('OrdersCtrl', OrdersCtrl);

function OrdersCtrl(OrderService, $location, $scope, $rootScope) {
  $rootScope.currentUser._id
  OrderService.getOrders($rootScope.currentUser._id).then(
    (res) => {
      console.log('data')
      console.log(res.data)
      $scope.buyOrders = res.data.buyOrders
      $scope.sellOrders = res.data.sellOrders
      $scope.tradeOrders = res.data.tradeOrders
      $scope.pendingOrders = res.data.pendingOrders
    }
  )

  $scope.viewOrder = function(id) {
    $location.path('/order/' + id)
  }
}
