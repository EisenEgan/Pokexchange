const mongoose = require('mongoose')
const moment = require('moment')
const Order = mongoose.model('Order')
const Message = mongoose.model('Message')
const Card = mongoose.model('Card')

exports.buyCard = function(req, res) {
  var card = req.body.card
  var buyer = req.body.buyer

  var orderObj = {
    type: 'Buy',
    buyer: buyer._id,
    seller: card.owner,
    total: card.price,
    firstPersonCard: card._id
  }


  Order.create(orderObj, (err, order) => {
    if (err) {
      res.status(500).json(err)
    } else {
      order.populate('buyer seller', (err) => {
        // Note: give user address.
        var header = `${order.buyer.username} has purchased your item ${card.name} (${card._id}) for $${card.price}`
        var message = `Congratulations your item <a href="/card/${card._id}">${card.name} (${card._id})</a> was purchased at ${order.createdAt} by <a href="/profile/${order.buyer.username}">${order.buyer.username}</a> for $${card.price}. Please wait until payment has been recieved before shipping the item.`
        var sellerMessageObj = {
          sender: order.buyer._id,
          recipient: card.owner,
          header: header,
          message: message
        }
        Message.create(sellerMessageObj, function(err, message) {
          if (err) {
            res.status(500).json(err)
          } else {
            var header = `You purchased item ${card.name} (${card._id}) from ${order.seller.username} for $${card.price}`
            var buyerMessage = `Congratulations you puchased the item <a href="/card/${card._id}">${card.name} (${card._id})</a> from <a href="profile/${order.seller.username}">${order.seller.username}</a> at ${order.createdAt} for $${card.price}. Please send payment to address __ for item to be shipped.`
            var buyerMessageObj = {
              sender: card.owner,
              recipient: order.buyer._id,
              header: header,
              message: buyerMessage
            }
            Message.create(buyerMessageObj, function(err, message) {
              if (err) {
                res.status(500).json(err)
              } else {
                Card.findById(card._id, (err, card) => {
                  card.sold = true
                  card.save((err) => {
                    if (err) {
                      res.status(500).json(err)
                    } else {
                      res.status(200).json({success: true})
                    }
                  })
                })
              }
            })
          }
        })
      })
    }
  })
}

exports.tradeCard = function(req, res) {
  var sellerCard = req.body.sellerCard
  var buyerCard = req.body.buyerCard
  var buyer = req.body.buyer

  Card.findById(sellerCard._id, (err, card) => {
    if (err) {
      res.status(500).json(err)
    } else if (!card.tradable) {
      res.status(500).json({'Error': 'Card is not tradeable.'})
    } else {
      var orderObj = {
        type: 'Trade',
        buyer: buyer._id,
        seller: sellerCard.owner,
        firstPersonCard: sellerCard._id,
        secondPersonCard: buyerCard._id,
        firstCardsRecieved: false,
        secondCardsRecieved: false
      }
      Order.create(orderObj, (err, order) => {
        if (err) {
          res.status(500).json(err)
        } else {
          order.populate('buyer seller', (err) => {
            var header = `${order.buyer.username} has offered to trade your item ${sellerCard.name} (${sellerCard._id}) for their item ${buyerCard.name} (${buyerCard._id}).`
            var message = `Please reveiew the offer to trade your item <a href="/card/${sellerCard._id}">${sellerCard.name} (${sellerCard._id})</a> for item <a href="/card/${buyerCard._id}">${buyerCard.name} (${buyerCard._id})</a> made by <a href="/profile/${order.buyer.username}">${order.buyer.username}</a> on ${moment(order.createdAt).format('llll')}.`
            var sellerMessageObj = {
              sender: order.buyer._id,
              recipient: sellerCard.owner,
              order: order._id,
              tradeOffer: true,
              header: header,
              message: message
            }
            Message.create(sellerMessageObj, (err, message) => {
              if (err) {
                res.status(500).json(err)
              } else {
                var header = `You offered to trade ${order.seller.username} your item ${buyerCard.name} (${buyerCard._id}) for their item ${sellerCard.name} (${sellerCard._id}).`
                var buyerMessage = `You offered to trade your item <a href="/card/${buyerCard._id}">${buyerCard.name} (${buyerCard._id})</a> to <a href="/profile/${order.seller.username}">${order.seller.username}</a> for their item <a href="/card/${sellerCard._id}">${sellerCard.name} (${sellerCard._id})</a> on ${moment(order.createdAt).format('llll')}. Please wait for them to accept or reject the offer.`
                var buyerMessageObj = {
                  sender: sellerCard.owner,
                  recipient: order.buyer._id,
                  header: header,
                  message: buyerMessage
                }
                Message.create(buyerMessageObj, (err, message) => {
                  if (err) {
                    res.status(500).json(err)
                  } else {
                    res.status(200).json({success: true})
                  }
                })
              }
            })
          })
        }
      })
    }
  })
}

exports.acceptOffer = function(req, res) {
  var orderId = req.body.orderId
  var messageId = req.body.messageId

  Message.findById(messageId, (err, message) => {
    message.tradeOffer = false
    message.order = undefined
    message.save((err) => {
      Order.findById(orderId, (err, order) => {
        order.tradeAccepted = true
        order.save((err) => {
          order.populate('seller buyer firstPersonCard secondPersonCard', (err) => {
            if (err) {
              res.status(500).json(err)
            } else {
              order.firstPersonCard.traded = true
              order.firstPersonCard.save((err) => {
                order.secondPersonCard.traded = true
                order.secondPersonCard.save((err) => {
                  if (err) res.status(500).json(err)
                  var header = `${order.seller.username} has accepted to trade their item ${order.firstPersonCard.name} (${order.firstPersonCard._id}) for your item ${order.secondPersonCard.name} (${order.secondPersonCard._id}).`
                  var message = `Congratulations, <a href="/profile/${order.seller.username}">${order.seller.username}</a> has accepted your offer made on ${moment(order.createdAt).format('llll')} to trade their item <a href="/card/${order.firstPersonCard._id}">${order.firstPersonCard.name} (${order.firstPersonCard._id})</a> for your item <a href="/card/${order.secondPersonCard._id}">${order.secondPersonCard.name} (${order.secondPersonCard._id})</a>. Please send your item to __.`
                  var buyerMessageObj = {
                    sender: order.seller._id,
                    recipient: order.buyer._id,
                    header: header,
                    message: message
                  }
                  Message.create(buyerMessageObj, (err, message) => {
                    var header = `You've accepted to trade your item ${order.firstPersonCard.name} (${order.firstPersonCard._id}) to ${order.buyer.username} for their item ${order.secondPersonCard.name} (${order.secondPersonCard._id}).`
                    var message = `You've accepted the offer made by <a href="/profile/${order.buyer.username}">${order.buyer.username}</a> on ${moment(order.createdAt).format('llll')} to trade their item <a href="/card/${order.secondPersonCard._id}">${order.secondPersonCard.name} (${order.secondPersonCard._id})</a> for your item <a href="/card/${order.firstPersonCard._id}">${order.firstPersonCard.name} (${order.firstPersonCard._id})</a>. Please send your item to __.`
                    var sellerMessageObj = {
                      sender: order.buyer._id,
                      recipient: order.seller._id,
                      header: header,
                      message: message
                    }
                    Message.create(sellerMessageObj, (err, message) => {
                      if (err) {
                        res.status(500).json(err)
                      } else {
                        res.status(200).json({success: true})
                      }
                    })
                  })
                })
              })
            }
          })
        })
      })
    })
  })
}

exports.rejectOffer = function(req, res) {
  var orderId = req.body.orderId
  var messageId = req.body.messageId

  Message.findById(messageId, (err, message) => {
    message.tradeOffer = false
    message.order = undefined
    message.save((err) => {
      Order.findById(orderId, (err, order) => {
        order.tradeAccepted = false
        order.save((err) => {
          order.populate('seller buyer firstPersonCard secondPersonCard', (err) => {
            if (err) {
              res.status(500).json(err)
            } else {
              var header = `${order.seller.username} has rejected the offer to trade their item ${order.firstPersonCard.name} (${order.firstPersonCard._id}) for your item ${order.secondPersonCard.name} (${order.secondPersonCard._id}).`
              var message = `<a href="/profile/${order.seller.username}">${order.seller.username}</a> has rejected your offer made on ${moment(order.createdAt).format('llll')} to trade their item <a href="/card/${order.firstPersonCard._id}">${order.firstPersonCard.name} (${order.firstPersonCard._id})</a> for your item <a href="/card/${order.secondPersonCard._id}">${order.secondPersonCard.name} (${order.secondPersonCard._id})</a>. Perhaps offer to trade another item.`
              var buyerMessageObj = {
                sender: order.seller._id,
                recipient: order.buyer._id,
                header: header,
                message: message
              }
              Message.create(buyerMessageObj, (err, message) => {
                var header = `You've rejected the offer to trade your item ${order.firstPersonCard.name} (${order.firstPersonCard._id}) to ${order.buyer.username} for their item ${order.secondPersonCard.name} (${order.secondPersonCard._id}).`
                var message = `You've rejected the offer made by <a href="/profile/${order.buyer.username}">${order.buyer.username} on ${moment(order.createdAt).format('llll')} to trade
                their item <a href="/card/${order.secondPersonCard._id}">${order.secondPersonCard.name} (${order.secondPersonCard._id})</a> for your item <a href="${order.firstPersonCard._id}">${order.firstPersonCard.name} (${order.firstPersonCard._id})</a>. Perhaps see whether the user has any other items you'd be interested in.`
                var sellerMessageObj = {
                  sender: order.buyer._id,
                  recipient: order.seller._id,
                  header: header,
                  message: message
                }
                Message.create(sellerMessageObj, (err, message) => {
                  if (err) {
                    res.status(500).json(err)
                  } else {
                    res.status(200).json({success: true})
                  }
                })
              })
            }
          })
        })
      })
    })
  })
}

exports.getOrders = function(req, res) {
  var id = req.params.id
  Order.find({
    $or: [
      { buyer: id },
      { seller: id }
    ]
  })
  .populate('firstPersonCard secondPersonCard')
  .lean()
  .exec((err, orders) => {
    if (err) res.status(500).json(err)
    var buyOrders = []
    var sellOrders = []
    var tradeOrders = []
    var pendingOrders = []
    for (order of orders) {
      if (order.type == 'Trade') {
        if (order.tradeAccepted && order.tradeAccepted == true) {
          if (order.buyer == id) {
            var seller = order.seller
            order.buyer = seller
            order.seller = id
            var firstPersonCard = order.firstPersonCard
            order.firstPersonCard = order.secondPersonCard
            order.secondPersonCard = firstPersonCard
            tradeOrders.push(order)
          } else {
            tradeOrders.push(order)
          }
        } else if (order.tradeAccepted && order.tradeAccepted == false) {

        } else {
          if (order.buyer == id) {
            var seller = order.seller
            order.buyer = seller
            order.seller = id
            var sellerCard = order.sellerCard
            order.sellerCard = order.buyerCard
            order.buyerCard = sellerCard
            pendingOrders.push(order)
          } else {
            pendingOrders.push(order)
          }
        }
      } else {
        if (order.buyer == id) {
          buyOrders.push(order)
        } else {
          sellOrders.push(order)
        }
      }
    }
    var orders = {
      buyOrders: buyOrders,
      sellOrders: sellOrders,
      tradeOrders: tradeOrders,
      pendingOrders: pendingOrders
    }
    res.status(200).json(orders)
  })
}

exports.getOrder = function(req, res) {
  Order
    .findById(req.params.id)
    .populate('buyer seller firstPersonCard secondPersonCard')
    .exec((err, order) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(order)
      }
    })
}
