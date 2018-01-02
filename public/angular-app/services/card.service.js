angular.module('pokexchange').service('CardService',
function($http, $rootScope) {

  this.tradeCard = undefined

  this.getCards = function() {
    return $http.get('http://localhost:3000/api/cards')
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.getUserCards = function() {
    return $http.get('http://localhost:3000/api/cards/' + $rootScope.currentUser._id)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.filterCards = function(filterConditions) {
    return $http.post('http://localhost:3000/api/cards', filterConditions).then(
      (res) => {
        return res
      }, (err) => {
        console.log(err)
      }
    )
  }

  this.getCard = function(id) {
    return $http.get('http://localhost:3000/api/card/' + id).then(
      (res) => {
        return res
      }, (err) => {
        console.log(err)
      }
    )
  }

  this.setTradeCard = function(card) {
    console.log('herp')
    this.tradeCard = card
  }

  this.addCard = function(card) {
    console.log('hit')
    // var picFile = card.picFile
    // delete card.picFile

    var fd = new FormData()
    // fd.append('file', picFile)
    angular.forEach(card, function (value, key) {
      fd.append(key, value);
    });
    return $http.post('http://localhost:3000/api/card', fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(
      (res) => {
        return res
      },
      (err) => {
        console.log(err)
      }
    )

    // customFormDataObject formDataObject = function (data, headersGetter) {
    //   var fd = new FormData();
    //   angular.forEach(data, function (value, key) {
    //     fd.append(key, value);
    //   });
    //
    //   var headers = headersGetter();
    //   delete headers['Content-Type'];
    //
    //   return fd;
    // }
    //
    // return $http({
    //   method: 'POST',
    //   url: 'http://localhost:3000/api/card',
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   data: {
    //     data: card,
    //     file: picFile
    //   },
    //   transformRequest: customFormDataObject
    // }).then(
    //   (res) => {
    //     return res
    //   }
    // )

    // return $http({
    //   url: 'http://localhost:3000/api/card',
    //   method: 'POST',
    //   data: fd,
    //   headers: {'Content-Type': undefined}
    // }).then(
    //   (res) => {
    //     return res;
    //   }
    // )
  }
})
