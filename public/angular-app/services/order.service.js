angular.module('pokexchange').service('OrderService',
function($http) {
  // this.getUserCards = function() {
  //   return $http.get('http://localhost:3000/api/cards/' + $rootScope.currentUser._id)
  //   .then((res) => {
  //     return res
  //   }, (err) => {
  //     console.log(err)
  //   })
  // }

  this.buyCard = function(orderInfo) {
    return $http.post('http://localhost:3000/api/order', orderInfo)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.tradeCard = function(orderInfo) {
    return $http.post('http://localhost:3000/api/trade', orderInfo)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.acceptOffer = function(offerInfo) {
    return $http.post('http://localhost:3000/api/trade/accept', offerInfo)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.rejectOffer = function(offerInfo) {
    return $http.post('http://localhost:3000/api/trade/reject', offerInfo)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.getOrders = function(id) {
    return $http.get('http://localhost:3000/api/orders/' + id)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.getOrder = function(id) {
    return $http.get('http://localhost:3000/api/order/' + id)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

})
