const StaffHead = require('../Models/StaffHead');
const generatePassword = require('../utils/generatePassword');

// Add Staff Head (addedBy is required)
exports.addStaffHead = async (req, res) => {
  try {
    const { name, email, mobile, password, addedBy } = req.body;

    if (!name || !email || !mobile || !addedBy) {
      return res.status(400).json({ message: 'Name, email, mobile, and addedBy are required' });
    }

    const existing = await StaffHead.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Staff head already exists' });

    const staffPassword = password || generatePassword();
    const photo = req.file?.path || '';

    const staff = new StaffHead({
      name,
      email,
      mobile,
      password: staffPassword,
      photo,
      addedBy, // required
    });

    await staff.save();

    res.status(201).json({
      message: 'Staff Head added successfully',
      credentials: { email, password: staffPassword },
    });
  } catch (err) {
    console.error('Add Staff Head Error:', err);
    res.status(500).json({ message: 'Server error while adding staff head' });
  }
};

// Login (basic, no token)
exports.staffHeadLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await StaffHead.findOne({ email });
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
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed due to server error' });
  }
};

// Get all staff heads (with optional search)
exports.getStaffHeads = async (req, res) => {
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

    const staffHeads = await StaffHead.find(finalQuery)
      .populate('addedBy', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(staffHeads);
  } catch (err) {
    console.error('Fetch Staff Heads Error:', err);
    res.status(500).json({ message: 'Error fetching staff heads' });
  }
};

// Update staff head
exports.updateStaffHead = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  try {
    const updated = await StaffHead.findByIdAndUpdate(id, { name, email, mobile }, { new: true });
    res.json({ message: 'Staff Head updated', updated });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Error updating staff head', error: err.message });
  }
};

// Soft delete staff head
exports.deleteStaffHead = async (req, res) => {
  const { id } = req.params;

  try {
    await StaffHead.findByIdAndUpdate(id, { deleted: true });
    res.json({ message: 'Staff Head deleted (soft delete)' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Error deleting staff head', error: err.message });
  }
};
