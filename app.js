var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

// Variables for routing
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const profileRouter = require('./routes/profile');

var app = express();

// view engine setup
const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Requires Login
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
      // console.log('require login passes');
      next();
  } else {
      // console.log('not logged in');
      res.redirect('/login');
  }
}


// Routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/profile', requireLogin, profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use('*', (req, res) => {
  res.status(400).send("Error: Picked up by the catchall.");
})

module.exports = app;
