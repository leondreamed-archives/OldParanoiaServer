const io = require('socket.io-client');
const Room = require('../../models/Room');
const to = require('await-to-js').default;

module.exports = async (req, res) => {
  const [e, room] = await to(Room.create({name: req.params.room}));
  if (e) return res.status(400).json({error: e});
  return {success: true, data: room};
};
