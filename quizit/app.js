var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/quizit?auto_reconnect', {safe:true});

var routes = require('./routes/index');
var users = require('./routes/users');
var quiz = require('./server/quiz');
var userbase = require('./server/userbaseinit');
var bonusbase = require('./server/bonusbase.js');

var app = express();

app.use(function(req, res, next) {
  req.db = {};
  req.db.userbase = db.collection('userbase');
  req.db.questionbase = db.collection('questionbase');
  req.db.bonusbase = db.collection('bonusbase');
  next();
})

// view engine setup
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/userbaseinit',userbase.userbaseinit);
app.use('/bonusbaseinit',bonusbase.init);
app.get('/quiz',quiz.list);
app.post('/contribute',quiz.contributeQuestion);

app.get('/render', function(req,res,next){
    req.db.userbase.find({}).toArray(function(error,userbase ){
    if (error) return next(error);
    res.send(
        userbase
    );
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log("catch error");
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
