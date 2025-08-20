const express = require('express');
const router = express.Router();
const ContactsController = require('../Controller/ContactsController');

// @route   POST /api/smm/upload-leads
// @desc    Upload leads by SMM
// @access  Public (no auth as per your request)
router.post('/upload-leads', ContactsController.uploadLeads);


router.get('/get-leads', ContactsController.getLeads);
router.get('/get-passport-holder-leads/:assignedToId', ContactsController.getPassportHolderLeads);


// Assign leads to calling team
router.post('/assign-leads', ContactsController.assignLeads);
router.post('/apply-interview', ContactsController.ApplyForInterview);

// Deassign leads
router.post('/deassign-leads', ContactsController.deassignLeads);


//update formFilled
router.put('/form-filled/:id', ContactsController.updateFormFilled);

router.put('/update-lead-status/:id', ContactsController.updateLeadStatus);


router.get('/get-assigned-leads/:assignedToId', ContactsController.getLeadsByAssignedTo);

router.get("/get-by-interview/:InterviewManagerId",ContactsController.getLeadsByInterviewManager);
router.put("/interview/pass/:id", ContactsController.markInterviewPass);
router.put("/interview/fail/:id", ContactsController.markInterviewFail);

router.get('/getbyId/:id',ContactsController.getContactById );

router.get('/get-transferredTo-leads/:id', ContactsController.getLeadsByTransferredTo);

module.exports = router;
    