const PreVisa = require('../Models/PreVisaModel');
const generatePassword = require('../utils/generatePassword');

// Add Staff Head (addedBy is required)
exports.addPreVisa = async (req, res) => {
  try {
    const { name, email, mobile, password, addedBy } = req.body;

    if (!name || !email || !mobile || !addedBy) {
      return res.status(400).json({ message: 'Name, email, mobile, and addedBy are required' });
    }

    const existing = await PreVisa.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Pre-Visa Officer is already exists' });

    const preVisa = password || generatePassword();

    const staff = new PreVisa({
      name,
      email,
      mobile,
      password: preVisa,
      addedBy, // required
    });

    await staff.save();

    res.status(201).json({
      message: 'Pre-Visa Officer added successfully',
      credentials: { email, password: preVisa },
    });
  } catch (err) {
    console.error('Add Pre-Visa Officer Error:', err);
    res.status(500).json({ message: 'Server error while adding Pre-Visa Officer' });
  }
};

// Login (basic, no token)
exports.PreVisaLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await PreVisa.findOne({ email });
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
exports.getPreVisa = async (req, res) => {
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

    const PreVisas = await PreVisa.find(finalQuery)
      .populate('addedBy', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(PreVisas);
  } catch (err) {
    console.error('Fetch PreVisa Error:', err);
    res.status(500).json({ message: 'Error fetching PreVisa Officer' });
  }
};

// Update staff head
exports.updatePreVisa = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  try {
    const updated = await PreVisa.findByIdAndUpdate(id, { name, email, mobile }, { new: true });
    res.json({ message: 'PreVisa Officer updated', updated });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Error updating PreVisa Officer', error: err.message });
  }
};

// Soft delete staff head
exports.deletePreVisa = async (req, res) => {
  const { id } = req.params;

  try {
    await PreVisa.findByIdAndUpdate(id, { deleted: true });
    res.json({ message: 'PreVisa deleted (soft delete)' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Error deleting PreVisa', error: err.message });
  }
};
