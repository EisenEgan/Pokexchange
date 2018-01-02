const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  tradeOffer: Boolean,
  header: String,
  message: String,
  messageType: {
    type: String,
    default: 'auto'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  timeSince: String
})

mongoose.model('Message', MessageSchema)
