const InterviewManager = require('../Models/InterviewManagerModel');
const generatePassword = require('../utils/generatePassword');

// Add Staff Head (addedBy is required)
exports.addInterviewManager = async (req, res) => {
  try {
    const { name, email, mobile, password, addedBy } = req.body;

    if (!name || !email || !mobile || !addedBy) {
      return res.status(400).json({ message: 'Name, email, mobile, and addedBy are required' });
    }

    const existing = await InterviewManager.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Pre-Visa Officer is already exists' });

    const InterviewManagers = password || generatePassword();

    const staff = new InterviewManager({
      name,
      email,
      mobile,
      password: InterviewManagers,
      addedBy, // required
    });

    await staff.save();

    res.status(201).json({
      message: 'Pre-Visa Officer added successfully',
      credentials: { email, password: InterviewManagers },
    });
  } catch (err) {
    console.error('Add Pre-Visa Officer Error:', err);
    res.status(500).json({ message: 'Server error while adding Pre-Visa Officer' });
  }
};

// Login (basic, no token)
exports.InterviewManagerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await InterviewManager.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed due to server error' });
  }
};

// Get all staff heads (with optional search) 
exports.getInterviewManager = async (req, res) => {
  try {
    const { search } = req.query;
    const baseCondition = { deleted: { $ne: true } };

    const searchCondition = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const finalQuery = { ...baseCondition, ...searchCondition };

    const InterviewManagers = await InterviewManager.find(finalQuery)
      .populate('addedBy', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(InterviewManagers);
  } catch (err) {
    console.error('Fetch InterviewManager Error:', err);
    res.status(500).json({ message: 'Error fetching InterviewManager Officer' });
  }
};

// Update staff head
exports.updateInterviewManager = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  try {
    const updated = await InterviewManager.findByIdAndUpdate(id, { name, email, mobile }, { new: true });
    res.json({ message: 'InterviewManager Officer updated', updated });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Error updating InterviewManager Officer', error: err.message });
  }
};

// Soft delete staff head
exports.deleteInterviewManager = async (req, res) => {
  const { id } = req.params;

  try {
    await InterviewManager.findByIdAndUpdate(id, { deleted: true });
    res.json({ message: 'InterviewManager deleted (soft delete)' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Error deleting InterviewManager', error: err.message });
  }
};
