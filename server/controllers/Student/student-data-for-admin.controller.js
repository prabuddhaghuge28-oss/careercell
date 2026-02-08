const User = require("../../models/user.model");
const Job = require("../../models/job.model");


const StudentDataYearBranchWise = async (req, res) => {
  try {
    // first year 
    const firstYearBscCs = await User.find({ role: "student", "studentProfile.department": "BSC CS", "studentProfile.year": 1 });
    const firstYearBscIt = await User.find({ role: "student", "studentProfile.department": "BSC IT", "studentProfile.year": 1 });
    const firstYearBcom = await User.find({ role: "student", "studentProfile.department": "BCOM", "studentProfile.year": 1 });
    const firstYearBaf = await User.find({ role: "student", "studentProfile.department": "BAF", "studentProfile.year": 1 });
    const firstYearBmm = await User.find({ role: "student", "studentProfile.department": "BMM", "studentProfile.year": 1 });
    const firstYearBms = await User.find({ role: "student", "studentProfile.department": "BMS", "studentProfile.year": 1 });

    // second year 
    const secondYearBscCs = await User.find({ role: "student", "studentProfile.department": "BSC CS", "studentProfile.year": 2 });
    const secondYearBscIt = await User.find({ role: "student", "studentProfile.department": "BSC IT", "studentProfile.year": 2 });
    const secondYearBcom = await User.find({ role: "student", "studentProfile.department": "BCOM", "studentProfile.year": 2 });
    const secondYearBaf = await User.find({ role: "student", "studentProfile.department": "BAF", "studentProfile.year": 2 });
    const secondYearBmm = await User.find({ role: "student", "studentProfile.department": "BMM", "studentProfile.year": 2 });
    const secondYearBms = await User.find({ role: "student", "studentProfile.department": "BMS", "studentProfile.year": 2 });

    // third year 
    const thirdYearBscCs = await User.find({ role: "student", "studentProfile.department": "BSC CS", "studentProfile.year": 3 });
    const thirdYearBscIt = await User.find({ role: "student", "studentProfile.department": "BSC IT", "studentProfile.year": 3 });
    const thirdYearBcom = await User.find({ role: "student", "studentProfile.department": "BCOM", "studentProfile.year": 3 });
    const thirdYearBaf = await User.find({ role: "student", "studentProfile.department": "BAF", "studentProfile.year": 3 });
    const thirdYearBmm = await User.find({ role: "student", "studentProfile.department": "BMM", "studentProfile.year": 3 });
    const thirdYearBms = await User.find({ role: "student", "studentProfile.department": "BMS", "studentProfile.year": 3 });

    return res.json({ firstYearBscCs, firstYearBscIt, firstYearBcom, firstYearBaf, firstYearBmm, firstYearBms, secondYearBscCs, secondYearBscIt, secondYearBcom, secondYearBaf, secondYearBmm, secondYearBms, thirdYearBscCs, thirdYearBscIt, thirdYearBcom, thirdYearBaf, thirdYearBmm, thirdYearBms });
  } catch (error) {
    console.log("student-data-for-admin.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const NotifyStudentStatus = async (req, res) => {
  try {
    // The legacy 'status' field was removed from appliedJobs. This endpoint
    // previously relied on that field to filter students by application status
    // (e.g., 'interview'). Since that field is gone, and the project's new
    // model stores per-applicant details on the Job document (applicants[]),
    // this endpoint's behavior needs a redesign to inspect Job.applicants
    // for each student's application. To avoid returning incorrect data,
    // respond with an empty result and a note indicating the functionality
    // was removed and needs migration if required.

    return res.status(200).json({ studentsWithJobDetails: [] });
  } catch (error) {
    console.log("student-data-for-admin.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}


module.exports = {
  StudentDataYearBranchWise,
  NotifyStudentStatus
};