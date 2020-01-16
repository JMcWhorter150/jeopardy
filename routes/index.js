var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});

const session = require('express-session');
const FileStore = require('session-file-store')(session);
router.use(session({
    store: new FileStore({}),
    secret: process.env.SESSION_KEY
}));


const user = require('../models/users');
// Get login page
router.get('/login', (req, res, next) => {
  res.render('login');
});

// Login post
router.post('/login', parseForm, async (req, res) => {
    const { name, password } = req.body;
    const didLoginSuccessfully = await user.login(name, password);
    if (didLoginSuccessfully) {
        const theUser = await user.getByUsername(name);
        req.session.user = {
            name,
            id: theUser.id
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
