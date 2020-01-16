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

const user = require('../models/users');

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
        navbar: req.session.navbar.value
      }
  });
});


// Get login page
router.get('/login', (req, res, next) => {
  res.render('login', {
    locals: {
      pagetitle: 'Login'
    },
    partials: {
      navbar: req.session.navbar.value
    }
  });
});

// Login post
router.post('/login', parseForm, async (req, res) => {
    const { name, password } = req.body;
    const didLoginSuccessfully = await user.login(name, password);
    if (didLoginSuccessfully) {
        const theUser = await user.getByUsername(name);
        req.session.navbar.value = '/partials/navbar-loggedin';
        req.session.user = {
            name,
            id: theUser.id,
            // navbar: '/partials/navbar-loggedin'
        };
        req.session.save(() => {
            res.redirect('/profile');
        });
    } else {
        console.log(`incorrect login.`);
    }
});

// Logout
router.get('/logout', (req, res)=>{
  req.session.destroy(() => {
          res.redirect('/login');
    });
});

module.exports = router;
