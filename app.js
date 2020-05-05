var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressLayouts = require('express-ejs-layouts');
var expressStatusMonitor = require('express-status-monitor');
var session = require('express-session');
const mongoose = require('mongoose');
var flash = require('connect-flash');

var app = express();
app.use(expressStatusMonitor());
app.use(expressValidator());
var usersRouter = require('./routes/users');
require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
//db setup
require('./configs/mongo.config');
var MongoStore = require('connect-mongo')(session);
var db = mongoose.connection;

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  maxAge: new Date(Date.now() + 3600000), //1 Hour
  expires: new Date(Date.now() + 3600000), //1 Hour
  store: new MongoStore({ mongooseConnection: db })
}));

// BodyParser Middleware



app.use('/users', usersRouter);
require('./routes/index')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
