const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  passportNumber: {
    type: String,
    unique: true,
    default: null,
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
  transferredDate: {
    type: Date,
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
  InterviewManager:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'InterviewManager',
  },
  InterviewStatus:{
    type:String,
    enum: ['Pass', 'Fail', 'Applied', 'Not Applied'],
    default: 'Not Applied',
  },
  InterviewAppliedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'CallingTeam'
  },
  InterviewApplyDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Interested', 'Not Interested', 'Passport Holder', 'Client', 'Agent'],
    default: null,
  },
  isFormFilled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
