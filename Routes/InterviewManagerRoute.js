const express = require('express');
const router = express.Router();
const {
  addInterviewManager,
  getInterviewManager,
  deleteInterviewManager,
  updateInterviewManager,
  InterviewManagerLogin
} = require('../Controller/InterviewManagerController');

// Add staff head (photo optional)
router.post('/add',addInterviewManager);

// Login (simple version)
router.post('/login', InterviewManagerLogin);

// Get all staff heads
router.get('/getAll/', getInterviewManager);

// Update
router.put('/:id', updateInterviewManager);

// Soft delete
router.delete('/:id', deleteInterviewManager);

module.exports = router;
