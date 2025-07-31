const Registration = require('../Models/ClientForm');

exports.addRegistration = async (req, res) => {
  try {
    const {
      name,
      mobile,
      passportNumber,
      country,
      salary,
      jobRole,
      serviceCharge,
      registrationCharge,
      medicalCharge,
      filledBy,
      leadId,
    } = req.body;

    // Get uploaded file URLs
    const photoUrl = req.files?.photo?.[0]?.path || '';
    const signatureUrl = req.files?.signature?.[0]?.path || '';

    // Count existing docs to generate regNo
    const count = await Registration.countDocuments();
    const regNo = (count + 1).toString().padStart(3, '0'); // e.g., "001"

    const newReg = new Registration({
      regNo,
      name,
      mobile,
      passportNumber,
      country,
      salary,
      jobRole,
      serviceCharge,
      registrationCharge,
      medicalCharge,
      photo: photoUrl,
      signature: signatureUrl,
      filledBy,
      leadId,
    });

    const savedReg = await newReg.save();
    res.status(201).json({ message: 'Registration added', data: savedReg });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register', error: error.message });
  }
};
