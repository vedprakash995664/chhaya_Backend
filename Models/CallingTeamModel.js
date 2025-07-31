const mongoose = require('mongoose');

const CallingTeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
   deleted: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'StaffHead', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CallingTeam', CallingTeamSchema);
