var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var config = require('./server.conf.json')[process.env.ENV || 'local'];

var router = require('./router'),
    socketServer = require('./socketServer');

var db;

app.set('port', config.HTTP_PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
app.use('/static', express.static(path.resolve(__dirname, '../static')));
app.set('views', path.resolve(__dirname, '../'));
app.use('/components', express.static(path.resolve(__dirname, '../components')));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);


// db - Mongo Connect
mongo.connect(config.MONGODB_URL, function(err, database) {
  if(err){
    console.log('* Error: database connection failed. Check if mongo is running?');
    return;
  }

  app.set('db', database);

  // includes the routes
  router(app, io);

  // fires up socket.io
  socketServer(io, database);


  http.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

});


