// get the required modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

// Database needs to be called library.db and needs to be in your root folder
var file = 'library.db'

var exists = fs.existsSync(file); // does this file exist?
var db = new sqlite3.Database(file); // open the database

// if database does not exist create it
db.serialize(function () {
  if (!exists) {
    db.run('CREATE TABLE library (Id INTEGER PRIMARY KEY, Title TEXT, Artist TEXT, Genre TEXT, Notes TEXT)');
  }
});


// routes
var routes = require('./routes/index'); // index.js
var library = require('./routes/library'); // library.js

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes); // route root to index.js
app.use('/library', library); // route /library url to library.js

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
