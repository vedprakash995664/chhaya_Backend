const express = require('express');
const router = express.Router();
const ContactsController = require('../Controller/ContactsController');

// @route   POST /api/smm/upload-leads
// @desc    Upload leads by SMM
// @access  Public (no auth as per your request)
router.post('/upload-leads', ContactsController.uploadLeads);


router.get('/get-leads', ContactsController.getLeads);


// Assign leads to calling team
router.post('/assign-leads', ContactsController.assignLeads);

// Deassign leads
router.post('/deassign-leads', ContactsController.deassignLeads);

router.put('/update-lead-status/:id', ContactsController.updateLeadStatus);


router.get('/get-assigned-leads/:assignedToId', ContactsController.getLeadsByAssignedTo);

router.get('/get-transferredTo-leads/:id', ContactsController.getLeadsByTransferredTo);

module.exports = router;
    