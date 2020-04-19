const io = require('socket.io-client');
const Room = require('../../models/Room');
const to = require('await-to-js').default;

module.exports = async (req, res) => {
  const socket = io.connect(process.env.SERVER);
  const {room} = req.params;

  const [e, dbRoom] = await to(Room.findOne({name: room}));
  if (e) return res.status(400).json({error: e});
  if (!dbRoom) return res.json({
    message: 'Failed to find room.',
    error: e,
  });
  if (!dbRoom.active) return res.json({
    message: 'User not active.'
  });
  socket.on('connect', () => {
    socket.emit('join-room', room, function() {
      socket.emit('take-screenshot', room);
      socket.on('took-screenshot', function(base64) {
        res.json({base64});
        socket.disconnect();
      });
    });
  });
};
