angular.module('pokexchange').service('MessageService',
function($http, $rootScope) {

  this.getMessages = function(userInfo) {
    return $http.post('http://localhost:3000/api/messages', userInfo)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.getMessage = function(id) {
    return $http.get('http://localhost:3000/api/message/' + id)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.sendMessage = function(messageInfo) {
    return $http.post('http://localhost:3000/api/message', messageInfo)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.deleteMessages = function(messagesToDelete) {
    return $http.post('http://localhost:3000/api/messages/delete', messagesToDelete)
    .then((res) => {
      return res
    }, (err) => {
      console.log(err)
    })
  }

  this.recipient = {}
  this.subject = ""

  this.setRecipient = function(recipient) {
    this.recipient = recipient
  }

  this.getRecipient = function() {
    return this.recipient
  }

  this.setSubject = function(subject) {
    this.subject = subject
  }

  this.getSubject = function() {
    return this.subject
  }
})
