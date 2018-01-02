const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
  const db = mongoose.connect(config.db)

  require('../api/models/card.server.model')
  require('../api/models/message.server.model')
  require('../api/models/order.server.model')
  require('../api/models/user.server.model')

  return db
}
