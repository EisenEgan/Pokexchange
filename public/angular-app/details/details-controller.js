angular.module('pokexchange').controller('DetailsCtrl', DetailsCtrl);

function DetailsCtrl(CardService, OrderService, $location, $routeParams, $rootScope) {

  var vm = this
  var id = $routeParams.id

  CardService.getCard(id).then(
    (res) => {
      vm.card = res.data.card
      vm.user = res.data.user
      console.log('user', vm.user)
      if ($rootScope.currentUser) {
        vm.giveOptions = vm.card.owner != $rootScope.currentUser._id && !vm.card.sold && !vm.card.traded
      } else {
        vm.giveOptions = false;
      }
    }
  )

  vm.tradeCard = function() {
    console.log('tradeCard')
    CardService.setTradeCard(vm.card)
    $location.path('/trade')
  }

  vm.buyCard = function() {
    var orderInfo = {
      // cardId: vm.card._id,
      // total: vm.card
      // seller: vm.card.owner,
      card: vm.card,
      buyer: $rootScope.currentUser
    }
    OrderService.buyCard(orderInfo).then((res) => {
      $location.path('/messages')
    })
  }
}
