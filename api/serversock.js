var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')


// Express Setup
var app = express();
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.render('clientsocket', {});
});


// Socket IO Setup
var server = require('http').createServer(app)
var io = require('socket.io')(server)
server.on('listening', () => console.log('Listening :' + server.address().port))
server.listen(4000)

var users = {}

io.on('connection', (socket) => {

  socket.on('new message', (data) => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // Ochawin ask for joining
  socket.on('new user', function (username) {
    
    socket.username = username;
    users[username] = new Date()

    // Welcome you, our special member, ochawin!
    socket.emit('login', {
    	username: socket.username,
    	users: users
    });

    // Hey everyone! ochawin has joined
    socket.broadcast.emit('user joined', {
      username: socket.username,
      users:users
    });
  });

  // Ochawin ask for logout
  socket.on('disconnect', function () {
  	delete users[socket.username]

  	// Hey everyone! ochawin has lefted
  	socket.broadcast.emit('user left', {
    	username: socket.username,
    	users: users
  	});
  });
})