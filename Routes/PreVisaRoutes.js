const express = require('express');
const router = express.Router();
const {
  addPreVisa,
  getPreVisa,
  deletePreVisa,
  updatePreVisa,
  PreVisaLogin
} = require('../Controller/PreVisaController');

// Add staff head (photo optional)
router.post('/add',addPreVisa);

// Login (simple version)
router.post('/login', PreVisaLogin);

// Get all staff heads
router.get('/', getPreVisa);

// Update
router.put('/:id', updatePreVisa);

// Soft delete
router.delete('/:id', deletePreVisa);

module.exports = router;
