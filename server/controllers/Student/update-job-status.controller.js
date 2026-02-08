const User = require("../../models/user.model");
const JobSchema = require("../../models/job.model");
const Notice = require("../../models/notice.model");
const Company = require("../../models/company.model");


const UpdateJobStatus = async (req, res) => {
  try {
    const job = await JobSchema.findById(req.params.jobId);
    const student = await User.findById(req.params.studentId)

    if (!job || !student) res.json({ msg: "Student or Job Not Found!" })

    // Update applicant details except the legacy 'status' field which was removed
    job.applicants.find(app => {
      if (app.studentId == req.params.studentId) {
        if (req.body.applicant.currentRound) app.currentRound = req.body.applicant.currentRound;
        if (req.body.applicant.roundStatus) app.roundStatus = req.body.applicant.roundStatus;
        if (req.body.applicant.selectionDate) app.selectionDate = req.body.applicant.selectionDate;
        if (req.body.applicant.joiningDate) app.joiningDate = req.body.applicant.joiningDate;
        if (req.body.applicant.offerLetter) app.offerLetter = req.body.applicant.offerLetter;
      }
    });

    student?.studentProfile?.appliedJobs?.find(app => {
      if (app.jobId == req.params.jobId) {
        // 'status' was removed from appliedJobs; preserve package and other updates
        if (req.body.applicant.package) app.package = req.body.applicant.package;
      }
    })

    await student.save();
    await job.save();
    // Note: automatic system notices/notifications on job status updates
    // were intentionally removed. If you need to re-enable them,
    // restore the Notice.create logic here.

    return res.json({ msg: "Job Status Updated Successfully!" });
  } catch (error) {
    console.log("update-job-status.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}


module.exports = {
  UpdateJobStatus
};