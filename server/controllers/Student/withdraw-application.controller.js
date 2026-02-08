const User = require("../../models/user.model");
const jobSchema = require("../../models/job.model");

const WithdrawFromJob = async (req, res) => {
  try {
    // Ensure middleware populated req.user
    const requester = req.user;
    if (!requester) return res.status(401).json({ msg: 'Login Required!' });

    if (req.params.studentId === "undefined") return res.status(400).json({ msg: "Invalid student" });
    if (req.params.jobId === "undefined") return res.status(400).json({ msg: "Invalid job" });

    // If requester is a student, they can only withdraw their own application
    if (requester.role === 'student' && String(requester._id) !== String(req.params.studentId)) {
      return res.status(403).json({ msg: 'Forbidden: cannot withdraw another student\'s application' });
    }

    const user = await User.findById(req.params.studentId);
    const job = await jobSchema.findById(req.params.jobId);

    if (!user || !job) return res.status(404).json({ msg: "Student or Job not found" });

    // remove from user's appliedJobs
    if (user.studentProfile && Array.isArray(user.studentProfile.appliedJobs)) {
      user.studentProfile.appliedJobs = user.studentProfile.appliedJobs.filter(a => String(a.jobId) !== String(req.params.jobId));
    }

    // remove from job applicants
    if (Array.isArray(job.applicants)) {
      job.applicants = job.applicants.filter(a => String(a.studentId) !== String(req.params.studentId));
    }

    await user.save();
    await job.save();

    return res.status(200).json({ msg: "Application withdrawn successfully" });
  } catch (error) {
    console.log("withdraw-application.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = {
  WithdrawFromJob
}
