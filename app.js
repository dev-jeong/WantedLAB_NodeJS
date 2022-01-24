var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res, next) { res.render('index.html'); });
app.get('/board', function (req, res, next) { res.render('board.html'); });

app.use('/api', require('./routes/api'));

// database setting
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.db');

db.run(
  `CREATE TABLE IF NOT EXISTS board ( 
    \`idx\` INTEGER PRIMARY KEY AUTOINCREMENT, 
    \`subject\` TEXT,
    \`context\` TEXT, 
    \`name\` TEXT, 
    \`password\` TEXT,
    \`reg_ts\` TEXT,
    \`edit_ts\` TEXT 
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS reply (
    \`idx\` INTEGER PRIMARY KEY AUTOINCREMENT,
    \`board_idx\` INTEGER,
    \`context\` TEXT, 
    \`name\` TEXT,
    \`reg_ts\` TEXT
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS rereply ( 
    \`reply_idx\` INTEGER,
    \`context\` TEXT, 
    \`name\` TEXT,
    \`reg_ts\` TEXT
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS keyword ( 
    \`name\` TEXT,
    \`reg_word\` TEXT
  )`
);

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
