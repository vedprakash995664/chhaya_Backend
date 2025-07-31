const CallingTeam = require('../Models/CallingTeamModel');
const generatePassword = require('../utils/generatePassword');
// Add Member
exports.addCallingTeam = async (req, res) => {
  try {
    const { name, phone, gender, password, email, city, addedBy } = req.body;
    if (!name || !phone || !gender || !email || !password || !city || !addedBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await CallingTeam.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

     const smmPassword = password || generatePassword();
    const newMember = new CallingTeam({ name, phone, gender, email, password:smmPassword, city, addedBy });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  
// Get All
exports.getCallingTeam = async (req, res) => {
  try {
    const team = await CallingTeam.find({ deleted: false }).populate('addedBy');
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//get Added BY 
exports.getCallingTeamByAddedBy = async (req, res) => {
  try {
    const { addedById } = req.params;

    const callingTeams = await CallingTeam.find({
      addedBy: addedById,
      deleted: false,
    }).select('_id name email phone');

    res.status(200).json(callingTeams);
  } catch (error) {
    console.error('Error fetching calling teams:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
// Update
exports.updateCallingTeam = async (req, res) => {
  try {
    const updated = await CallingTeam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soft Delete
exports.deleteCallingTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeam = await CallingTeam.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedTeam) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.loginCallingTeam = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await CallingTeam.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
