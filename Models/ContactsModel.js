const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SMM',
    required: true,
  },
  transferredTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StaffHead',
    required: true,
  },
  AssignedTO: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CallingTeam',
  },
  AssignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StaffHead',
  },
  AssignedDate: {
    type: Date,
  },
  transferredDate: {
    type: Date,
    required: true,
  },
  status: {
  type: String,
  enum: ['Interested', 'Not Interested', 'Passport Holder', 'Client', 'Agent'],
  default: null,
},
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{
   timestamps: true 
});

module.exports = mongoose.model('Lead', leadSchema);
