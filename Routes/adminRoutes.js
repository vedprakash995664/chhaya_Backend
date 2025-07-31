const express = require('express');
const { loginAdmin } = require('../Controller/adminController');
const { protect } = require('../Middleware/authMiddleware');

const router = express.Router();

// Only login route is exposed
router.post('/login', loginAdmin);

// Example protected route
router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome Admin ID: ${req.admin.id}` });
});

module.exports = router;
