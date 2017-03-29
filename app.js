var compression = require('compression');
var express = require('express');
var app = express();

//open gzip
app.use(compression());

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var routes = require('./routes/index');
var blog = require('./routes/blog');
var users = require('./routes/users');
var typetag = require('./routes/typeTag');
var article = require('./routes/article');
var comment = require('./routes/comment');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var util = require('util');

var fs = require('fs');
var FileStreamRotator = require('file-stream-rotator');
var logDirectory = __dirname + '/logs';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/log-%DATE%.log',
  frequency: 'daily',
  verbose: false
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine(".html", ejs.renderFile);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  store: new MongoStore({
    url:util.format("mongodb://%s:%s@%s:%s/%s",settings.user,settings.pwd,settings.host,settings.port,settings.db)
  })
}));

app.use('/', routes);
app.use('/blog', blog);
app.use('/user',users);
app.use('/typetag',typetag);
app.use('/article',article);
app.use('/comment',comment);
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
