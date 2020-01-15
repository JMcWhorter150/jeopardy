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
    secret: 'itsthatjeopardybitch'
}));

// Get login page
router.get('/', (req, res, next) => {
  res.render('login');
});

// Login post
router.post('/login', parseForm, async (req, res) => {
    const { name, password } = req.body;
    const didLoginSuccessfully = await owners.login(name, password); //!!!!!!!!!!!!!!!!!!!!!!!
    if (didLoginSuccessfully) {
        const theUser = await owners.getByUsername(name); //!!!!!!!!!!!!!!!!!!!!!!!
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


module.exports = router;