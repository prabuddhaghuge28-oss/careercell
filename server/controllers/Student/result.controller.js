const User = require('../../models/user.model');

const UploadResult = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No result file uploaded' });
    }

    // Get the result type from request body (sem1, sem2, sem3, sem4, sem5, sem6, hsc, ssc, diploma)
    const resultType = req.body.resultType;
    
    if (!resultType || !['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'hsc', 'ssc', 'diploma'].includes(resultType)) {
      return res.status(400).json({ msg: 'Invalid result type. Must be one of: sem1, sem2, sem3, sem4, sem5, sem6, hsc, ssc, diploma' });
    }

    // Update user's result file info in the database
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ msg: 'Student not found!' });
    }

    const resultPath = "/results/" + req.file.filename;

    // Update the specific result file
    if (!user.studentProfile.resultFiles) {
      user.studentProfile.resultFiles = {};
    }
    
    user.studentProfile.resultFiles[resultType] = {
      filename: req.file.filename,
      filepath: resultPath,
      contentType: req.file.mimetype
    };
    
    await user.save();

    return res.status(200).json({ msg: 'Result file uploaded successfully!' });
  } catch (error) {
    console.error('Error in result.controller.js => ', error);
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
}

module.exports = UploadResult;
