const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    index: true,
    match: /.+\@.+\..+/
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  userLevel: {
    type: Number,
    default: 1
  },
  password: {
    type: String,
    validate: [
      function(password) {
        return password.length >= 8
      },
      'Password should be longer'
    ]
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  created: {
    type: Date,
    default: Date.now
  },
  address: String,
  city: String,
  state: String,
  avatarUrl: String,
  website: {
    type: String,
    // set: function(url) {
    //   if (!url) {
    //     return url
    //   } else {
    //     if (url.indexOf('http://') !== 0 &&
    //     url.indexOf('http://') !== 0) {
    //       url = 'http://' + url
    //     }
    //   }
    // }
  }
})

// Add average rating, and number of reviews later

UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName)
    return this.firstName + ' ' + this.lastName
}).set(function(fullName) {
  const splitName = fullName.split(' ')
  this.firstName = splitName[0] || ''
  this.lastName = splitName[1] || ''
})

UserSchema.pre('save', function(next) {
  if (!this.salt && this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64')
    this.password = this.hashPassword(this.password)
  }
  next()
})

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64')
}

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password)
}

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var possibleUsername = username + (suffix || '')
  this.findOne({
    username: possibleUsername
  }, (err, user) => {
    if (!err) {
      if (!user) {
        callback(possibleUsername)
      } else {
        return this.findUniqueUsername(username, (suffix || 0) + 1, callback)
      }
    } else {
      callback(null)
    }
  })
}

UserSchema.set('toJSON', { getters: true, virtuals: true })

UserSchema.statics.findOneByUsername = function(username, callback) {
  this.findOne({ username: new RegExp(username, 'i') }, callback)
}

mongoose.model('User', UserSchema)
