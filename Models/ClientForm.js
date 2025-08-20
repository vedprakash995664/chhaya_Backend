const mongoose = require('mongoose');

const ClientFormSchema = new mongoose.Schema({
  // Personal Details
  fullName: String,
  fatherName: String,
  address: String,
  state: String,
  pinCode: String,
  contactNo: String,
  whatsAppNo: String,
  familyContact: String,
  email: String,

  // Passport Details
  passportNumber: { type: String, required: true },
  passportIssue: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  passportExpiry: { type: String, required: true },
  nationality: { type: String, default: 'Indian' },
  ecr: { type: Boolean, default: false },
  ecnr: { type: Boolean, default: false },

  // Work Details
  occupation: String,
  placeOfEmployment: String,
  lastExperience: String,
  lastSalaryPostDetails: String,
  expectedSalary: String,
  medicalReport: String,
  InterviewStatus: String,
  pccStatus: String,
  photo: {
    type: String,
    required: true,
  },
  Sign: {
    type: String,
    required: true,
  },

  // Office Section
  agentCode: {
     type: mongoose.Schema.Types.ObjectId,
    ref: 'CallingTeam',
  },
  officeConfirmation: {
    country: String,
    work: String,
    salary: String,
    ServiceCharge: String,
    MedicalCharge: String,
  },
  transferredDate: {
    type: Date,
    default: Date.now()
  },
  transferredTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StaffHead',
  },
  transferredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CallingTeam',
  },
  regNo: { type: String, unique: true },
  filledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CallingTeam',
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },

},{
   timestamps: true 
});

// Auto-generate regNo without Counter
ClientFormSchema.pre('save', async function (next) {
  const doc = this;

  if (!doc.isNew) return next();

  try {
    const lastDoc = await mongoose.model('ClientForm').findOne({}, { regNo: 1 })
      .sort({ regNo: -1 })
      .lean();

    let nextNumber = 1;
    if (lastDoc && lastDoc.regNo) {
      const numPart = parseInt(lastDoc.regNo.replace('CHY', ''), 10);
      nextNumber = numPart + 1;
    }

    doc.regNo = `CHY${String(nextNumber).padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('ClientForm', ClientFormSchema);
