const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Configure multer for result file uploads
const resultDir = path.join(__dirname, '..', 'public', 'results');

const resultStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the results directory exists. Create recursively if needed.
    try {
      if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir, { recursive: true });
      }
      cb(null, resultDir + path.sep);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadResult = multer({
  storage: resultStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (e.g., 10MB)
  fileFilter: (req, file, cb) => {
    // Only accept PDF, DOC, DOCX, and image file formats
    const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only PDF, DOC, DOCX, JPG, JPEG, or PNG files are allowed!');
    }
  }
});

module.exports = uploadResult;
