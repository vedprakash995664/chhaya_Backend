const Registration = require('../Models/ClientForm');

exports.addRegistration = async (req, res) => {
  try {
    const {
      fullName, fatherName, address, state, pinCode, contactNumber,
      whatsappNumber, familyContact, email, passportNumber, dob,
      passportIssue, passportExpiry, nationality, ecr, ecnr,
      occupation, placeOfEmployment, lastExperience, lastSalary,InterviewStatus,ServiceCharge,MedicalCharge,
      expectedSalary, medicalReport, pccStatus, agentCode,
      country, work, salary, filledBy, leadId,
    } = req.body;

    const existingReg = await Registration.findOne({ leadId });
    if (existingReg) {
      return res.status(400).json({ message: 'Form already submitted for this lead.' });
    }

    const photoUrl = req.files?.clientPhoto?.[0]?.path || '';
    const signUrl = req.files?.clientSign?.[0]?.path || '';

    const newReg = new Registration({
      fullName,
      fatherName,
      address,
      state,
      pinCode,
      contactNo: contactNumber,
      whatsAppNo: whatsappNumber,
      familyContact,
      email,
      passportNumber,
      passportIssue,
      dateOfBirth: dob,
      passportExpiry,
      nationality,
      ecr,
      ecnr,
      occupation,
      placeOfEmployment,
      lastExperience,
      lastSalaryPostDetails: lastSalary,
      expectedSalary,
      medicalReport,
      InterviewStatus,
      pccStatus,
      agentCode,
      Sign: signUrl,
      photo: photoUrl,
      officeConfirmation: {
        country,
        work,
        salary,
        ServiceCharge,
        MedicalCharge
      },
      filledBy,
      leadId
    });

    await newReg.save();
    res.status(201).json({ message: 'Registration created successfully', regNo: newReg.regNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/registration/:id
  exports.updateRegistration = async (req, res) => {
    try {
      const { id } = req.params;

      // Exclude restricted fields from update
      const {
        contactNo,
        email,
        agentCode,
        passportNumber,
        passportIssue,
        passportExpiry,
        dateOfBirth,
        photo,
        Sign,
        ...updateFields
      } = req.body;

      const updatedRegistration = await Registration.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updatedRegistration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      res.status(200).json({
        message: 'Registration updated successfully',
        data: updatedRegistration
      });
    } catch (err) {
      console.error('Error updating registration:', err);
      res.status(500).json({ message: err.message });
    }
  };


exports.transferClientForms = async (req, res) => {
  try {
    const { leadIds, transferredTo, transferredBy } = req.body;
    console.log(leadIds);
    console.log(transferredBy);
    console.log(transferredTo);
    

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: 'leadIds must be a non-empty array.' });
    }

    if (!transferredTo || !transferredBy) {
      return res.status(400).json({ message: 'transferredTo and transferredBy are required.' });
    }

    // Update the leads collection - change the assigned calling team member
    const updateResult = await Registration.updateMany(
      { leadId: { $in: leadIds } }, // Now using lead _id correctly
      {
          transferredTo: transferredTo, // or whatever field represents who the lead is assigned to
          transferredBy: transferredBy,
          transferredDate: Date.now(),
        }
    );
    
    console.log('Update result:', updateResult);
    
    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ 
        message: 'No leads found with the provided IDs.' 
      });
    }

    res.status(200).json({
      message: `${updateResult.modifiedCount} lead(s) transferred successfully.`,
      totalMatched: updateResult.matchedCount,
      totalModified: updateResult.modifiedCount
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

//get all forms
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.status(200).json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getRegistrationsByTransferredTo = async (req, res) => {
  try {
    const { transferredTo } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {
      transferredTo,
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { passportNumber: { $regex: search, $options: 'i' } },
        { contactNo: { $regex: search, $options: 'i' } }
      ]
    };

    const total = await Registration.countDocuments(query);
    const registrations = await Registration.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("leadId")
      .populate("filledBy")
      .populate("transferredBy")
      .populate({
        path:"leadId",
        populate:"transferredTo AssignedBy zone"
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: registrations,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching registrations by transferredTo:', err);
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.status(200).json(registration);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// GET /api/registration/by-lead/:leadId
exports.getRegistrationByLeadId = async (req, res) => {
  try {
    const registration = await Registration.findOne({ leadId: req.params.leadId });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.status(200).json(registration);
  } catch (err) {
    console.error('Error fetching registration by leadId:', err);
    res.status(500).json({ message: err.message });
  }
};
