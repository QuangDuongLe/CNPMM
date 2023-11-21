const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({ 
  cloud_name: 'dgj5oa5c0', 
  api_key: '629579816616676', 
  api_secret: 'rNCuzXqi0AQ763zSHIcbFipKfiU' 
});


const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const uploadFile = multer({ storage });

module.exports = { uploadFile };
