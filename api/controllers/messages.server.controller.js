const mongoose = require('mongoose')
const moment = require('moment')
const Message = mongoose.model('Message')

exports.getMessages = function(req, res) {
  Message
    .find({ recipient: req.body.id })
    .populate({ path: 'sender', select: 'username' })
    .exec((err, messages) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(messages)
      }
    })
}

exports.getMessage = function(req, res) {
  Message
    .findById(req.params.id)
    .populate({ path: 'sender', select: 'username' })
    .exec((err, message) => {
      if (err) {
        res.status(500).json(err)
      } else {
        message.read = true
        message.save((err) => {
          message.timeSince = moment(message.createdAt).format("dddd, MMM D YYYY") + " (" + moment(message.createdAt).fromNow() + ")"
          if (err) {
            res.status(500).json(err)
          } else {
            res.status(200).json(message)
          }
        })
      }
    })
}

exports.sendMessage = function(req, res) {
  console.log('body')
  console.log(req.body)
  Message.create({
    sender: req.body.sender,
    recipient: req.body.recipient,
    header: req.body.subject,
    message: req.body.message,
    messageType: 'user'
  }, (err, message) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json({success: true})
    }
  })
}

exports.deleteMessages = function(req, res) {
  Message.remove({
    _id: { $in: req.body.messagesToDelete}
  }, function(err, response) {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json({success: true})
    }
  });
}
