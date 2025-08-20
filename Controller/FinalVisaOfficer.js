const FinalVisa = require('../Models/FinalVisaModel');
const generatePassword = require('../utils/generatePassword');

// Add Staff Head (addedBy is required)
exports.addFinalVisa = async (req, res) => {
  try {
    const { name, email, mobile, password, addedBy } = req.body;

    if (!name || !email || !mobile || !addedBy) {
      return res.status(400).json({ message: 'Name, email, mobile, and addedBy are required' });
    }

    const existing = await FinalVisa.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Pre-Visa Officer is already exists' });

    const FinalVisas = password || generatePassword();

    const staff = new FinalVisa({
      name,
      email,
      mobile,
      password: FinalVisas,
      addedBy, // required
    });

    await staff.save();

    res.status(201).json({
      message: 'Pre-Visa Officer added successfully',
      credentials: { email, password: FinalVisa },
    });
  } catch (err) {
    console.error('Add Pre-Visa Officer Error:', err);
    res.status(500).json({ message: 'Server error while adding Pre-Visa Officer' });
  }
};

// Login (basic, no token)
exports.FinalVisaLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await FinalVisa.findOne({ email });
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
exports.getFinalVisa = async (req, res) => {
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

    const FinalVisas = await FinalVisa.find(finalQuery)
      .populate('addedBy', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(FinalVisas);
  } catch (err) {
    console.error('Fetch FinalVisa Error:', err);
    res.status(500).json({ message: 'Error fetching FinalVisa Officer' });
  }
};

// Update staff head
exports.updateFinalVisa = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  try {
    const updated = await FinalVisa.findByIdAndUpdate(id, { name, email, mobile }, { new: true });
    res.json({ message: 'FinalVisa Officer updated', updated });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Error updating FinalVisa Officer', error: err.message });
  }
};

// Soft delete staff head
exports.deleteFinalVisa = async (req, res) => {
  const { id } = req.params;

  try {
    await FinalVisa.findByIdAndUpdate(id, { deleted: true });
    res.json({ message: 'FinalVisa deleted (soft delete)' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Error deleting FinalVisa', error: err.message });
  }
};
