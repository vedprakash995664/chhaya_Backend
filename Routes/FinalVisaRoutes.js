const express = require('express');
const router = express.Router();
const {
  addFinalVisa,
  getFinalVisa,
  deleteFinalVisa,
  updateFinalVisa,
  FinalVisaLogin
} = require('../Controller/FinalVisaOfficer');

// Add staff head (photo optional)
router.post('/add',addFinalVisa);

// Login (simple version)
router.post('/login', FinalVisaLogin);

// Get all staff heads
router.get('/', getFinalVisa);

// Update
router.put('/:id', updateFinalVisa);

// Soft delete
router.delete('/:id', deleteFinalVisa);

module.exports = router;
