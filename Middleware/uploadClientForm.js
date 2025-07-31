// middlewares/uploadRegistration.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'default';

    if (file.fieldname === 'photo') {
      folder = 'registration_photos';
    } else if (file.fieldname === 'signature') {
      folder = 'registration_signatures';
    }

    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 400, height: 400, crop: 'limit' }],
    };
  },
});

const uploadRegistration = multer({ storage });
module.exports = uploadRegistration;
   