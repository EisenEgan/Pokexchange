const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  total: Number,
  firstPersonCard: {
    type: Schema.Types.ObjectId,
    ref: 'Card'
  },
  secondPersonCard: {
    type: Schema.Types.ObjectId,
    ref: 'Card'
  },
  paid: {
    type: Boolean,
    default: false
  },
  tradeAccepted: Boolean,
  firstCardsRecieved: Boolean,
  secondCardsRecieved: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Order', OrderSchema)
