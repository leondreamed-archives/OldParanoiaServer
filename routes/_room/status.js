const Room = require('../../models/Room');
const to = require('await-to-js').default;

module.exports = async (req, res) => {
  const [e, room] = await to(Room.findOne({
    name: req.params.room
  }).exec());
  if (e) return res.status(400).json({error: e});
  if (!room) return res.json({
    success: false,
    message: 'Failed to find room.'
  });
  return res.json({success: true, data: room.active});
};
