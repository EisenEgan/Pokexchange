const passport = require('passport')
var express = require('express')
var router = express.Router()
var multer = require('multer')

// var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, '../../../public/uploads/')
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
//
// var upload = multer({
//   storage: storage
// });

const cards = require('../../api/controllers/cards.server.controller')
const messages = require('../../api/controllers/messages.server.controller')
const orders = require('../../api/controllers/orders.server.controller')
const users = require('../../api/controllers/users.server.controller')

router
  .route('/users')
  .get(users.getUsers)
  .put(users.updateUser)

router
  .route('/signup')
  // .get(users.renderSignup)
  .post(users.signup)

  // app.post('/signup', function(req, res, next){
  //   passport.authenticate('local-signup', function(err, user, info){
  //     if(err){return next(err);}
  //     if(!user){return res.send({redirect: '/signup'});}
  //     req.logIn(user, function(err) {
  //       if (err) { return next(err); }
  //       return res.send({redirect: '/posts'});
  //     });
  //   }) (req, res, next);
  // });

// router.post('/signin', function handleLocalAuthentication(req, res, next) {
//   console.log('reaches')
//   passport.authenticate('local', function(err, user, info) {
//     if (err) return next(err);
//     if (!user) {
//       console.log('user')
//       console.log(user)
//       console.log(req.body)
//       console.log(info)
//       return res.status(403).json({success: false});
//     }
//     console.log('herp')
//     // Manually establish the session...
//     req.login(user, function(err) {
//       if (err) return next(err);
//       return res.status(200).json({
//         success: true,
//         user: user
//       });
//     });
//   })(req, res, next);
// })

router
  .post("/signin", passport.authenticate('local'), function(req, res) {
    res.json(req.user);
  });

router
  .get("/loggedin", function(req, res) {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user)
    } else {
      res.status(200).json('0')
    }
  });

// router
//   .route('/signin')
// //   // .get(users.renderSignin)
//   .post(passport.authenticate('local', function(err, user, info) {
//       console.log('somethings happening')
//       if (err) {return next(err)}
//       if (!user) {return res.send({redirect: '/'})}
//       req.login(user, function(err) {
//         if (err) return next(err);
//         return res.json({
//           success: true,
//           user: user
//         });
//       });
//       // failureFlash: true
//   })
  // .post(passport.authenticate('local'), function(req, res) {
  //   console.log('user')
  //   console.log(req.user)
  //   res.status(200).json({success: true, user: req.user});
  // })

// router.post('/signin',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     // Then you can send your json as response.
//     res.json({success:true, user: req.user});
//   });

router
  .get('/signout', users.signout)

// router
//   .get('/oauth/facebook', passport.authenticate('facebook', {
//     failureRedirect: '/signin'
//   }))
//
// router
//   .get('/oauth/facebook/callback', passport.authenticate('facebook', {
//     failureRedirect: '/signin',
//     successRedirect: '/'
//   }))

// router
//   .get('/oauth/twitter', passport.authenticate('twitter', {
//     failureRedirect: '/'
//   }))

router.get('/oauth/twitter', function authenticateTwitter (req, res, next) {
  console.log('twit print')
  // req.session.returnTo = '/' + req.query.returnTo;
  req.session.returnTo = '/profile'
  next ();
}, passport.authenticate ('twitter'));

router.get('/oauth/twitter/callback', function (req, res, next) {
  console.log('something')
  console.log(req.session.returnTo)
 var authenticator = passport.authenticate('twitter', {
   successRedirect: req.session.returnTo,
   failureRedirect: '/'
  });
  delete req.session.returnTo;
  authenticator(req, res, next);
})

router.get('/oauth/google', function authenticateGoogle (req, res, next) {
  // req.session.returnTo = '/' + req.query.returnTo;
  req.session.returnTo = '/profile'
  next ();
}, passport.authenticate ('google', {
    failureRedirect: '/signin',
    scope: [
      'profile',
      'email'
    ]
  })
);

router.get('/oauth/google/callback', function (req, res, next) {
  console.log('something')
  console.log(req.session.returnTo)
 var authenticator = passport.authenticate('google', {
   successRedirect: req.session.returnTo,
   failureRedirect: '/'
  });
  delete req.session.returnTo;
  authenticator(req, res, next);
})

// router
//   .get('/oauth/twitter/callback',
//   passport.authenticate('twitter', {failureRedirect: '/signin'}),
//   function(req, res) {
//
//   })

  // router.post('/signin', function handleLocalAuthentication(req, res, next) {
  //   console.log('reaches')
  //   passport.authenticate('local', function(err, user, info) {
  //     if (err) return next(err);
  //     if (!user) {
  //       console.log('user')
  //       console.log(user)
  //       console.log(req.body)
  //       console.log(info)
  //       return res.status(403).json({success: false});
  //     }
  //     console.log('herp')
  //     // Manually establish the session...
  //     req.login(user, function(err) {
  //       if (err) return next(err);
  //       return res.status(200).json({
  //         success: true,
  //         user: user
  //       });
  //     });
  //   })(req, res, next);
  // })

// router
//   .get('/oauth/google', passport.authenticate('google', {
//     failureRedirect: '/signin',
//     scope: [
//       'profile',
//       'email'
//     ]
//   }))
//
// router
//   .get('/oauth/google/callback', passport.authenticate('google', {
//     failureRedirect: '/signin',
//     successRedirect: '/'
//   }))

router
  // .post('/card', upload.single('picFile'), cards.addCard)
  .post('/card', multer({ dest: './public/uploads/'}).single('picFile'), cards.addCard)

router
  .route('/cards')
  .get(cards.getCardsAndPokemonList)
  .post(cards.filterCards)

router.get('/card/:id', cards.getCard)

router.get('/cards/:id', cards.getUserCardsAndPokemonList)

router.post('/messages', messages.getMessages)
router.post('/messages/delete', messages.deleteMessages)
router.post('/message', messages.sendMessage)
router.get('/message/:id', messages.getMessage)

router.post('/order', orders.buyCard)
router.post('/trade', orders.tradeCard)

router.post('/trade/accept', orders.acceptOffer)
router.post('/trade/reject', orders.rejectOffer)

router.post('/profile', users.getUserInfoAndCards)

router.get('/orders/:id', orders.getOrders)
router.get('/order/:id', orders.getOrder)

module.exports = router
