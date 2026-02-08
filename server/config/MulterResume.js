const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Configure multer for resume uploads
const resumeDir = path.join(__dirname, '..', 'public', 'resumes');

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the resumes directory exists. Create recursively if needed.
    try {
      if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
      }
      cb(null, resumeDir + path.sep);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (e.g., 10MB)
  fileFilter: (req, file, cb) => {
    // Only accept PDF, DOC, DOCX file formats
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only PDF, DOC, or DOCX files are allowed!');
    }
  }
});

module.exports = uploadResume;
