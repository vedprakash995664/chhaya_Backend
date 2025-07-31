const SMM = require('../Models/smmModel');
const generatePassword = require('../utils/generatePassword');

// Add SMM
exports.addSMM = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'Name, email, and mobile are required' });
    }

    const existing = await SMM.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Social Media Manager already exists' });

    const smmPassword = password || generatePassword();

    const newSMM = new SMM({
      name,
      email,
      mobile,
      password: smmPassword,
      addedBy: req.body.addedBy || null, // optional addedBy if no auth middleware
    });

    await newSMM.save();

    res.status(201).json({
      message: 'Social Media Manager added',
      credentials: { email, password: smmPassword },
    });
  } catch (err) {
    console.error('Add SMM Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// SMM Login (without JWT)
exports.SMMLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await SMM.findOne({ email }).populate('addedBy');
    if (!user || password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({
      message: 'Login successful',
      user,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Get all SMMs (with optional search)
exports.getSMM = async (req, res) => {
  try {
    const { search } = req.query;

    const baseCondition = { deleted: false };
    const searchCondition = search
      ? {
          $or: [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { mobile: new RegExp(search, 'i') },
          ],
        }
      : {};

    const finalQuery = { ...baseCondition, ...searchCondition };

    const smms = await SMM.find(finalQuery)
      .populate('addedBy')
      .sort({ createdAt: -1 });

    res.status(200).json(smms);
  } catch (err) {
    console.error('Fetch SMM Error:', err);
    res.status(500).json({ message: 'Error fetching SMMs' });
  }
};

// Update SMM
exports.updateSMM = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, password } = req.body;

    const updated = await SMM.findByIdAndUpdate(
      id,
      {
        name,
        email,
        mobile,
        ...(password && { password }),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'SMM not found' });

    res.status(200).json({ message: 'SMM updated successfully' });
  } catch (err) {
    console.error('Update SMM Error:', err);
    res.status(500).json({ message: 'Failed to update SMM' });
  }
};

// Soft Delete SMM
exports.deleteSMM = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SMM.findByIdAndUpdate(id, { deleted: true }, { new: true });

    if (!deleted) return res.status(404).json({ message: 'SMM not found' });

    res.status(200).json({ message: 'SMM deleted' });
  } catch (err) {
    console.error('Delete SMM Error:', err);
    res.status(500).json({ message: 'Failed to delete SMM' });
  }
};
