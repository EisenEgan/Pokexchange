const passport = require('passport')
const url = require('url')
const TwitterStrategy = require('passport-twitter').Strategy
const config = require('../config')
const users = require('../../api/controllers/users.server.controller')

module.exports = function() {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    includeEmail: true,
    passReqToCallback: true
  }, (req, token, tokenSecret, profile, done) => {
    const providerData = profile._json
    providerData.token = token
    const providerUserProfile = {
      fullName: profile.displayName,
      username: profile.username,
      email: profile.emails[0].value,
      provider: 'twitter',
      providerId: profile.id,
      // providerData: providerData
    }
    users.saveOAuthUserProfile(req, providerUserProfile, done)
  }))
}
