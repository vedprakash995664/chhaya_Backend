const mongoose = require('mongoose');

const staffHeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Staff Head',
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },

  deleted: {
     type: Boolean,
      default: false,
    },
}, { timestamps: true });

// ❌ Password hashing removed

module.exports = mongoose.model('StaffHead', staffHeadSchema);
