// const multer = require('multer');
// const path = require('path');

// // Setting up multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/');  // Define the upload folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));  // Set unique file names
//   },
// });

// // File filter to accept only image files
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpeg|jpg|png/;
//   const isValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   if (isValid) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPG, PNG and JPEG are allowed.'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024,  // Max file size: 2MB
//   },
// });

// module.exports = upload;
const multer = require('multer');

// Use memory storage for Cloudinary
const storage = multer.memoryStorage();

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const isValid = allowedFileTypes.test(file.mimetype);
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and JPEG are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Max file size: 2MB
  },
});

module.exports = upload;

