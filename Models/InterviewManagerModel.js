const mongoose = require('mongoose');

const InterviewManagerSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Interview-Manager',
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


module.exports = mongoose.model('InterviewManager', InterviewManagerSchema);
