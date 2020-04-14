const port = process.env.PORT || 3000;
const path = require('path');

const app = require('express')();
const server = require('http').createServer(app);
server.listen(port);
const io = require('socket.io').listen(server);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let isClientConnected = false;

io.on('connection', function(socket) {
  socket.on('get-client-connection-status', function(fn) {
    fn(isClientConnected);
  });

  socket.on('client-disconnected', function() {
    socket.broadcast.emit('client-disconnected');
  });

  socket.on('client-connected', function() {
    socket.broadcast.emit('client-connected');
  })

  socket.on('took-screenshot', function(result) {
    socket.broadcast.emit('took-screenshot', result);
  })

  socket.on('take-screenshot', function() {
    socket.broadcast.emit('take-screenshot');
  });
});