const express = require('express');
const router = express.Router();
const registrationController = require('../Controller/ClientFromController');
const uploadRegistration = require('../Middleware/uploadClientForm'); // custom Multer setup for photo/signature

// Route to add a new registration with photo and signature uploads
router.post(
  '/add',
  uploadRegistration.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
  ]),
  registrationController.addRegistration
);

module.exports = router;
