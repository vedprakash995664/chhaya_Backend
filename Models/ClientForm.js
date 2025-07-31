const mongoose = require('mongoose');
const Counter = require('./Counter.js')
const registrationSchema = new mongoose.Schema({
  // Personal Details
  fullName: { type: String, },
  fatherName: { type: String, },
  address: { type: String, },
  state: { type: String, },
  pinCode: { type: String, },
  contactNo: { type: String, },
  whatsAppNo: { type: String },
  familyContact: { type: String },
  email: { type: String },

  // Passport Details
  passportNumber: { type: String, required: true },
  passportIssue: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  passportExpiry: { type: String, required: true },
  nationality: { type: String, default: 'Indian' },
  ecr: { type: Boolean, default: false },
  ecnr: { type: Boolean, default: false },

  // Work Details
  occupation: { type: String },
  placeOfEmployment: { type: String },
  lastExperience: { type: String },
  lastSalaryPostDetails: { type: String },
  expectedSalary: { type: String },
  medicalReport: { type: String },
  pccStatus: { type: String },

  // Office Section
  agentCode: { type: String },
  officeConfirmation: {
    country: { type: String },
    work: { type: String },
    salary: { type: String }
  },


  photo: {
  type: String,
  required: true  // if mandatory
},
signature: {
  type: String,
  required: true  // if mandatory
},

  // Meta
  date: { type: Date, default: Date.now },
  regNo: { type: String, unique: true },
  filledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CallingTeam',
    required: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  }
});

// Auto-increment hook before save
registrationSchema.pre('save', async function (next) {
  const doc = this;
  if (doc.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'registration' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const formattedNumber = String(counter.seq).padStart(3, '0');
      doc.regNo = `CHY${formattedNumber}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Registration', registrationSchema);