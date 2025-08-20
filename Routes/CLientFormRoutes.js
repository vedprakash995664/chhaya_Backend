const express = require('express');
const router = express.Router();
const registrationController = require('../Controller/ClientFromController');
const {clientUpload} = require('../Middleware/upload');
// Add new registration (no photo/signature)
router.post('/add',clientUpload, registrationController.addRegistration);

router.put('/update/:id', registrationController.updateRegistration);


router.post('/transfer',registrationController.transferClientForms);

router.get('/getAll', registrationController.getAllRegistrations);


router.get('/get-transferred/:transferredTo', registrationController.getRegistrationsByTransferredTo);
router.get('/getbyId/:id', registrationController.getRegistrationById);
router.get('/getbyleadId/:leadId', registrationController.getRegistrationByLeadId);

module.exports = router;
