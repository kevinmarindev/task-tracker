const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash-2')
const logger = require('morgan')
const methodOverride = require('method-override')
const connectToDB = require('./config/database');
const homeRoutes = require('./routes/home')
const todoRoutes = require('./routes/todos')



require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)


connectToDB()
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))

//testing

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      cookie: {},
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection})
    })
  );

  app.use(flash())


  // Passport middleware
  app.use(passport.initialize())
app.use(passport.session())



app.use('/', homeRoutes)
app.use('/todos', todoRoutes)


app.listen(process.env.PORT)