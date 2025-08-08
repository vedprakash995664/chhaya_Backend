const express = require('express');
const router = express.Router();
const {
  addStaffHead,
  getStaffHeads,
  deleteStaffHead,
  updateStaffHead,
  staffHeadLogin
} = require('../Controller/staffHeadController');

const {upload} = require('../Middleware/upload'); // multer + cloudinary

// Add staff head (photo optional)
router.post('/add', upload.single('photo'), addStaffHead);

// Login (simple version)
router.post('/login', staffHeadLogin);

// Get all staff heads
router.get('/', getStaffHeads);

// Update
router.put('/:id', updateStaffHead);

// Soft delete
router.delete('/:id', deleteStaffHead);

module.exports = router;
