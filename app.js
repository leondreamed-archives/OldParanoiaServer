const app = require('express')();
const http = require('http').createServer(app);
const port = process.env.PORT || 3000;
const path = require('path');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket) {
  socket.on('took-screenshot', function(result) {
    socket.broadcast.emit('took-screenshot', result);
  })
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});