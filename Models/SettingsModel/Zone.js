// models/SettingsModel/Zone.js
const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  zoneName: { type: String, required: true },
  zoneAddedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
