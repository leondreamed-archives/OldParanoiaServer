const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
});

const Room = mongoose.model('room', RoomSchema);
module.exports = Room;

