const port = process.env.PORT || 3000;
const path = require('path');

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket) {
  socket.on('took-screenshot', function(result) {
    socket.broadcast.emit('took-screenshot', result);
  })
});