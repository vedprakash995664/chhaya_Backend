const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true // ✅ Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Admin', adminSchema);
