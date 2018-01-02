angular.module('pokexchange').controller('TradeCtrl', TradeCtrl);

function TradeCtrl(CardService, OrderService, $location, $rootScope) {

  var vm = this

  vm.selectedCard = undefined;

  vm.tradeCard = CardService.tradeCard

  CardService.getUserCards().then(
    (res) => {
      vm.cards = res.data.cards
    }
  )

  vm.selectCard = function(card) {
    vm.selectedCard = card
  }

  vm.submitTrade = function() {
    vm.submitted = true
    if (vm.selectedCard) {
      tradeObj = {
        sellerCard: vm.tradeCard,
        buyerCard: vm.selectedCard,
        buyer: $rootScope.currentUser
      }
      OrderService.tradeCard(tradeObj).then((res) => {
        $location.path('/messages')
      })
    }
  }
}
