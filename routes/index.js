var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});

const session = require('express-session');
const FileStore = require('session-file-store')(session);
router.use(session({
  store: new FileStore({}),
  secret: process.env.SESSION_KEY,
  cookie: { secure: false }
}));

const users = require('../models/users');

router.use((req, res, next) =>{
  if (req.session && req.session.navbar) {
    //
  } else {
    req.session.navbar = {
      value: '/partials/navbar'
    }
  }
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      locals: {
        pagetitle: 'Home',
      },
      partials: {
        analytics: 'partials/analytics',
        head: '/partials/head',
        navbar: req.session.navbar.value,
        footer: '/partials/footer'
      }
  });
});


// Get login page
router.get('/login', (req, res, next) => {
  res.render('login', {
    locals: {
      pagetitle: 'Login',
      submitValue: 'Login'
    },
    partials: {
      analytics: 'partials/analytics',
      head: '/partials/head',
      navbar: req.session.navbar.value,
      footer: '/partials/footer'
    }
  });
});

// Login post
router.post('/login', parseForm, async (req, res) => {
    const { name, password } = req.body;
    const didLoginSuccessfully = await users.login(name, password);
    if (didLoginSuccessfully) {
        const theUser = await users.getByUsername(name);
        req.session.navbar.value = '/partials/navbar-loggedin';
        req.session.user = {
            name,
            id: theUser.id,
        };
        req.session.save(() => {
            res.redirect('/profile');
        });
    } else {

    }
});

// Logout
router.get('/logout', (req, res)=>{
  req.session.destroy(() => {
          res.redirect('/login');
    });
});

// Get signup page
router.get('/signup', (req, res, next) => {
  res.render('login', {
    locals: {
      pagetitle: 'Signup',
      submitValue: 'Signup'
    },
    partials: {
      analytics: 'partials/analytics',
      head: '/partials/head',
      navbar: req.session.navbar.value,
      footer: 'partials/footer'
    }
  });
});

// Signup post
router.post('/signup', parseForm, async (req, res) => {
    const { name, password } = req.body;
    const checkUsername = await users.checkUsername(name);
    if (checkUsername.length > 0) {
      res.send(`<h1>Please try another username.</h1><br>
      <h4><a href="/signup">Return to Signup</a><h4>`);
    } else {
      const createdUser = await users.create(name, password);
      if (createdUser) {
          const theUser = await users.addUserToDB(createdUser);
          res.redirect('/login');
      } else {
        // pass
      }
  }
});

module.exports = router;
