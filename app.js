require('dotenv').config();
const port = process.env.PORT || 4000;
const app = require('express')();
const server = require('http').createServer(app);
server.listen(port);
const io = require('socket.io').listen(server);
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://paranoia:${process.env.DB_PASSWORD}@paranoia-mxk3a.mongodb.net/test`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

const roomScreenshot = require('./routes/_room/screenshot');
app.get('/:room/screenshot', roomScreenshot);

const roomStatus = require('./routes/_room/status');
app.get('/:room/status', roomStatus);

const roomCreate = require('./routes/_room/create');
app.post('/:room', roomCreate);

const Room = require('./models/Room');
const to = require('await-to-js').default;

module.exports = async (req, res) => {
  const [e, room] = await to(Room.create({name: req.params.room}));
  if (e) return res.status(400).json({error: e});
  return room;
};

io.on('connection', function(socket) {
  socket.on('take-screenshot', function(room, fn) {
    socket.to(room).emit('take-screenshot');
  });

  socket.on('took-screenshot', function(room, base64) {
    socket.to(room).emit('took-screenshot', base64);
  });

  // create should only be called once per room by electron client
  socket.on('create-room', async function(room) {
    const [e] = await to(Room.updateOne({name: room}, {active: true}, {upsert: true}));
    if (e) console.error(e);
    socket.join(room);
    io.to(room).emit('subject-joined');
    socket.on('disconnect', async function() {
      io.to(room).emit('subject-left');
      const [e] = await to(Room.updateOne({name: room}, {active: false}));
      if (e) console.error(e);
    });
  });

  socket.on('join-room', function(room, fn) {
    socket.join(room);
    fn();
  });
});
