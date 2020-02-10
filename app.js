const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

// Variables for routing
const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');
const leaderboardRouter = require('./routes/leaderboard');
const gameRouter = require('./routes/game');

const app = express();

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
      next();
  } else {
      res.redirect('/login');
  }
}


// Routing
app.use('/', indexRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/profile', requireLogin, profileRouter);
app.use('/game', gameRouter);

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
  res.render('error', {
    locals: {
      pagetitle: 'Error'
    },
    partials: {
      analytics: 'partials/analytics',
      head: 'partials/head',
      navbar: req.session ? req.session.navbar.value : 'partials/navbar'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).send("Error: Picked up by the catchall.");
})

module.exports = app;
