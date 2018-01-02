const path = require('path')
// const config = require('./config')
const express = require('express')
const morgan = require('morgan')
// const compress = require('compression')
const bodyParser = require('body-parser')
// const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
// const flash = require('connect-flash')
const passport = require('passport')

module.exports = function() {
  const app = express()

  // if (process.env.NODE_ENV === 'development') {
  //   app.use(morgan('dev'))
  // } else if (process.env.NODE_ENV === 'production') {
  //   // app.use(compress())
  // }
  app.use(session({
  secret: 'superSecret'
  }));
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.use(bodyParser.json())
  // app.use(methodOverride())

  // app.use(session({
    saveUninitialized: true,
  //   resave: true,
  //   secret: config.sessionSecret
  // }))

  //change

  // app.set('views', './app/views')
  // app.set('view engine', 'ejs')

  app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
  });

  // app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session())

  app.use('/', express.static(path.resolve('./public')))
  app.use('/lib', express.static(path.resolve('./node_modules')))

  var routes = require('../api/routes/users.server.routes.js')
  app.use('/api', routes);
  // require('../api/routes/users.server.routes.js')(app)
  // require('../api/routes/index.server.routes.js')(app)

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html')
  })

  return app
}
