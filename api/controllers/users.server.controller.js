const User = require('mongoose').model('User')
const Card = require('mongoose').model('Card')
const passport = require('passport')

// function getErrorMessage(err) {
//   let message = ''
//   if (err.code) {
//     switch(err.code) {
//       case 11000:
//       case 11001:
//         message = 'Username already exists'
//         break
//       default:
//         message = 'Something went wrong'
//     }
//   } else {
//     for (var errName in err.errors) {
//       if (err.errors[errName].message)
//         message = err.errors[errName].message
//     }
//   }
//   return message
// }

// exports.renderSignin = function(req, res, next) {
//   if (!req.user) {
//     res.render('signin', {
//       title: 'Sign-in Form',
//       messages: req.flash('error') || req.flash('info')
//     })
//   } else {
//     return res.redirect('/')
//   }
// }

// exports.renderSignup = function(req, res, next) {
//   if (!req.user) {
//     res.render('signup', {
//       title: 'Sign-up Form',
//       messages: req.flash('error')
//     })
//   } else {
//     return res.redirect('/')
//   }
// }

exports.getUsers = function(req, res) {
  User
    .find()
    .exec(function(err, users) {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(users)
      }
    })
}

exports.updateUser = function(req, res) {
  // var user = req.body.user
  User.findById(req.body.user._id)
  .exec(function(err, user) {
    if (err) {
      res.status(500).json(err)
    } else if (!user) {
      res.status(404).json({"message": "User ID Invalid"})
    } else {
      user.email = req.body.user.email
      user.firstName = req.body.user.firstName ? req.body.user.firstName : undefined
      user.lastName = req.body.user.lastName ? req.body.user.lastName : undefined
      user.address = req.body.user.address ? req.body.user.address : undefined
      user.city = req.body.user.city ? req.body.user.city : undefined
      user.state = req.body.user.state ? req.body.user.state : undefined
      user.avatarUrl = req.body.user.avatarUrl ? req.body.user.avatarUrl : undefined
      user.website = req.body.user.website ? req.body.user.website : undefined
      user.save(function(err, updatedUser) {
        if (err) {
          res.status(500).json(err)
        } else {
          // Note: 204 returns no data
          res.status(204).json()
        }
      })
    }
  })
}

exports.getUserInfoAndCards = function(req, res) {
  User.findOne({username: req.body.username}).exec((err, user) => {
    if (err) {
      res.status(500).json(err)
    }
    if (!user) {
      res.status(200).json({success: false})
    } else {
      Card.find({owner: user._id, sold: false, traded: false}).exec((err, cards) => {
        if (err) {
          res.status(500).json(err)
        } else {
          res.status(200).json({
            success: true,
            user: user,
            cards: cards
          })
        }
      })
    }
  })
}

exports.signup = function(req, res, next) {
  if (!req.user) {
    const user = new User(req.body)
    // console.log('User')
    // console.log(user)
    user.provider = 'local'
    user.save((err) => {
      console.log('saved')
      if (err) {
        console.log(err)
        // const message = getErrorMessage(err)
        // req.flash('error', message)
        return res.status(400).json(err)
      }
      req.login(user, (err) => {
        if (err) return res.status(400).json(err)
        console.log('User created')
        console.log(user)
        return res.status(201).json({success: true, user: user})
      })
    })
  } else {
    return res.redirect('/')
  }
}

exports.signout = function(req, res) {
  req.logout()
  res.status(200).json()
}

exports.saveOAuthUserProfile = function(req, profile, done) {
  User.findOne({
    provider: profile.provider,
    providerId: profile.providerId
  }, (err, user) => {
    if (err) {
      return done(err)
    } else {
      if (!user) {
        //console.log(profile)
        // console.log('profile')
        // console.log(profile)
        // console.log('profile.username = ' + profile.username)
        const possibleUsername = profile.username ||
        ((profile.email) ? profile.email.split('@')[0]:'')
        //console.log('possibleUsername = ' + possibleUsername)
        User.findUniqueUsername(possibleUsername, null,
          (availableUsername) => {
          const newUser = new User(profile)
          newUser.username = availableUsername
          newUser.save((err) => {
            return done(err, newUser)
          })
        })
      } else {
        return done(err, user)
      }
    }
  })
}
