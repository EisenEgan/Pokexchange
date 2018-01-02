const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const CardSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  types: {
    type: [String]
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  tradable: Boolean,
  sold: {
    type: Boolean,
    default: false
  },
  traded: {
    type: Boolean,
    default: false
  },
  imagePath: {
    type: String,
    required: true,
    trim: true
  },
  originalImageName: {
    type: String,
    required: true
  },
  condition: {
    type: Number,
    min: 0,
    max: 10
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

mongoose.model('Card', CardSchema)
