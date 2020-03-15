const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT ;
var mysql = require('mysql');
const app = express();
var pool = mysql.createPool({
  connectionLimit: 10, 
  host: 'localhost',
  user: 'root',
  database: 'sgroup_login'
});
pool.getConnection(function (err, connection) {
  connection.query("SELECT * FROM users", function (err, rows) {
    connection.release();
    if (err) throw err;
    console.log(rows);
    //i tried this but it is not match :((
    // i want to switch typeof (data) to array, but I don't know how to do it 
    var users = [ {
      id: 3,
      name: 'Anh',
      email: 'jaywon@email.com',
      password: 'password123'
    }];

    const bcrypt = require('bcrypt')
    const passport = require('passport')
    const flash = require('express-flash')
    const session = require('express-session')
    const methodOverride = require('method-override')

    const initializePassport = require('./passport-config')
    initializePassport(
      passport,
      email => users.find(user => user.email === email),
      id => users.find(user => user.id === id)
    )
    app.set('view-engine', 'ejs')
    app.use(express.urlencoded({
      extended: false
    }))
    app.use(flash())
    app.use(session({
      secret: 'nana',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 24
      }
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(methodOverride('_method'))

    app.get('/', checkAuthenticated, (req, res) => {
      res.render('index.ejs', {
        name: req.user.name
      })
    })

    app.get('/login', checkNotAuthenticated, (req, res) => {
      res.render('login.ejs')
    })

    app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }))

    app.get('/register', checkNotAuthenticated, (req, res) => {
      res.render('register.ejs')
    })

    app.post('/register', checkNotAuthenticated, async (req, res) => {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
          id: Date.now().toString(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        })
        res.redirect('/login')
      } catch {
        res.redirect('/register')
      }
    })

    app.delete('/logout', (req, res) => {
      req.logOut()
      res.redirect('/login')
    })

    function checkAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }

      res.redirect('/login')
    }

    function checkNotAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return res.redirect('/')
      }
      next()
    }

  });
});
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});