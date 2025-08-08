const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudinary');

// 🔥 Shared Cloudinary storage engine with dynamic folder based on field name
const sharedStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'MiscFiles';

    if (file.fieldname === 'clientPhoto') folder = 'ClientPhoto';
    else if (file.fieldname === 'clientSign') folder = 'ClientSign';
    else if (file.fieldname === 'staffPhoto') folder = 'staff-heads';

    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 400, height: 400, crop: 'limit' }],
    };
  },
});

// 🟢 For staff head — single image
const upload = multer({ storage: sharedStorage });

// 🟢 For client registration — multiple files
const clientUpload = multer({ storage: sharedStorage }).fields([
  { name: 'clientPhoto', maxCount: 1 },
  { name: 'clientSign', maxCount: 1 },
]);


module.exports = {
  upload,       // Use in routes like upload.single('staffPhoto')
  clientUpload, // Use in routes like clientUpload.fields([{...}, {...}])
};
