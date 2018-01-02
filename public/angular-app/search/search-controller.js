angular.module('pokexchange').controller('SearchCtrl', SearchCtrl);

// Note: Use $window instead of $location when routing outside app.
function SearchCtrl($location, $window, CardService) {
  // To access user object: $rootScope.currentUser
  var vm = this

  vm.searchCriteria = {
    name: "All",
    type: "All",
    minCondition: undefined,
    maxCondition: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    tradable: false
  }

  vm.openSearch = false

  vm.conditionValues = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

  vm.cardObjs = []

  vm.newCard = function(chip) {
    return {
      name: chip,
      type: 'unknown'
    };
  };

  CardService.getCards().then(
    (res) => {
      vm.cards = res.data.cards
      vm.pokemonList = res.data.pokemonList
      vm.pokemonTypes = res.data.pokemonTypes
    }
  )

  vm.removeChip = function(chip) {
    console.log(chip)
    if (chip.name == "name" || chip.name == "type") {
      vm.searchCriteria[chip.name] = "All"
    } else {
      vm.searchCriteria[chip.name] = null
    }
    console.log(vm.searchCriteria)
    CardService.filterCards(vm.searchCriteria).then(
      (res) => {
        console.log(res)
        vm.cards = res.data
      }
    )
  }

  vm.submit = function(form) {
    if (form.$valid) {
      vm.cardObjs = []
      chips = []
      for (property in vm.searchCriteria) {
        console.log(vm.searchCriteria[property])
        if (vm.searchCriteria[property] != undefined && vm.searchCriteria[property] != false && vm.searchCriteria[property] != "All") {
          vm.cardObjs.push({
            'name': property,
            'property': vm.searchCriteria[property]
          })
        }
      }
      CardService.filterCards(vm.searchCriteria).then(
        (res) => {
          vm.cards = res.data
        }
      )
      // CardService.filterCards().then(
      //
      // )
    }
  }

  vm.toggleSearch = function() {
    vm.searchOpen = !vm.searchOpen
  }
}
