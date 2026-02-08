const jwt = require('jsonwebtoken');
const User = require("../../models/user.model");
const JobSchema = require("../../models/job.model");
const { normalizeStatus } = require('../../utils/status.util');


const AllJobs = async (req, res) => {
  try {
    // If an auth token is present and belongs to a management_admin,
    // hide job listings for that user by returning an empty list.
    try {
      const authHeader = req.header('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.role === 'management_admin') {
          return res.json({ data: [] });
        }
      }
    } catch (e) {
      // token invalid/expired: fall back to public behaviour
    }

    // Populate applicant student references so we can filter out any dangling references
    const jobs = await JobSchema.find().populate({
      path: 'applicants.studentId',
      select: '_id'
    });

    // Filter out applicants that no longer reference a valid student document
    const cleanedJobs = jobs.map(job => {
      // job.applicants may be an array of subdocs; keep only those with a valid studentId
      job.applicants = job.applicants ? job.applicants.filter(a => a && a.studentId) : [];
      // Deduplicate applicants by studentId in case of duplicate entries
      const seen = new Set();
      job.applicants = job.applicants.reduce((acc, a) => {
        const sid = String(a.studentId._id || a.studentId);
        if (!seen.has(sid)) {
          seen.add(sid);
          acc.push(a);
        }
        return acc;
      }, []);
      return job;
    });

    return res.json({ data: cleanedJobs });
  } catch (error) {
    console.log("user.all-jobs.controller.js => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const DeleteJob = async (req, res) => {
  try {
    if (req.body.jobId) {
      // console.log(req.body.jobId)
      const job = await JobSchema.findById(req.body.jobId);
      if (!job) return res.status(404).json({ msg: 'Job not found' });

      // before this middleware pre will run to delete student's appliedJobs
      await job.deleteOne();
      return res.status(200).json({ msg: 'Job deleted successfully!' });
    }
    return res.status(400).json({ msg: 'Missing jobId' });
  } catch (error) {
    console.log("user.all-jobs.controller.js => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}


const JobData = async (req, res) => {
  try {
    // pass if tpo is creating new post
    if (req.params.jobId !== 'undefined') {
      const job = await JobSchema.findById(req.params.jobId);
      return res.status(200).json(job);
    }
  } catch (error) {
    // checking if userId is exist or not
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'job data not found' });
    }
    console.log("user.all-jobs.controller.js => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const JobWithApplicants = async (req, res) => {
  try {
    const job = await JobSchema.findById(req.params.jobId)
      .populate({
        path: 'applicants.studentId',
        select: '_id first_name last_name email' // Select only name and email fields
      });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found!' });
    }

    // Filter out any applicants where the related student document couldn't be populated
    const validApplicants = job.applicants ? job.applicants.filter(a => a && a.studentId) : [];

    // Transform the applicants data for your table
    const applicantsList = validApplicants.map(applicant => ({
      id: applicant.studentId._id,
      name: (applicant.studentId.first_name || '') + " " + (applicant.studentId.last_name || ''),
      email: applicant.studentId.email || '',
      currentRound: applicant.currentRound,
      // legacy 'status' removed; frontend should use applicant.roundStatus/currentRound instead
      appliedAt: applicant.appliedAt,
    }));

    return res.status(200).json({ applicantsList });
  } catch (error) {
    console.log("Error fetching job with applicants => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};


// Export applicants for a job as CSV
const ExportJobApplicantsCSV = async (req, res) => {
  try {
    const job = await JobSchema.findById(req.params.jobId)
      .populate({
        path: 'applicants.studentId',
        select: '_id first_name last_name email studentProfile'
      })
      .populate({ path: 'company', select: 'companyName' });

    if (!job) return res.status(404).json({ msg: 'Job not found!' });

    // Filter valid populated applicants
    const validApplicants = job.applicants ? job.applicants.filter(a => a && a.studentId) : [];

    // CSV header
    const headers = [
      'Student ID',
      'Name',
      'Email',
      'ABCID',
      'Department',
      'Year',
      'Applied At',
      'Company',
      'Job Title'
    ];

    const escape = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      // escape double quotes by doubling them, and wrap field in quotes if it contains comma/newline/quote
      if (/[",\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
      return str;
    };

    const rows = validApplicants.map(a => {
      const student = a.studentId;
      const profile = student.studentProfile || {};
      return [
        student._id,
        `${student.first_name || ''} ${student.last_name || ''}`.trim(),
        student.email || '',
        profile.ABCID || '',
        profile.department || '',
        profile.year || '',
        a.appliedAt ? new Date(a.appliedAt).toISOString() : '',
        job.company?.companyName || '',
        job.jobTitle || ''
      ].map(escape).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    const filename = `applicants_job_${job._id}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.log('Error exporting applicants CSV => ', error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}


const StudentJobsApplied = async (req, res) => {
  try {
    // Find all jobs where the student has applied
    const appliedJobs = await JobSchema.find({ 'applicants.studentId': req.params.studentId })
      .populate('company', 'companyName') // Populates the company field to get companyName
      .select('jobTitle _id salary applicationDeadline applicants company') // Select the required fields
      .lean(); // Use lean to return plain JS objects, making it faster for read operations
    // console.log(appliedJobs)
    // Add the number of applicants for each job
    const result = appliedJobs.map(job => {
      // Find all applicant subdocuments that match this studentId, then pick the most recent one
      const matching = job.applicants.filter(a => String(a.studentId) === String(req.params.studentId));
      // If multiple entries exist, choose the one with the latest appliedAt
      const applicantDetails = matching.length > 0 ? matching.reduce((latest, curr) => (new Date(curr.appliedAt) > new Date(latest.appliedAt) ? curr : latest), matching[0]) : null;

      return {
        jobTitle: job.jobTitle,
        jobId: job._id,
        salary: job.salary,
        applicationDeadline: job.applicationDeadline,
        companyName: job.company.companyName,
        // Count unique applicants by studentId to avoid duplicates
        numberOfApplicants: new Set(job.applicants.map(a => String(a.studentId))).size,
        appliedAt: applicantDetails ? applicantDetails.appliedAt : null, // Fetch the appliedAt date for this student
        // legacy 'status' removed; frontend will not receive `status` here
        status: undefined // intentionally removed
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching student applied jobs => ", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};




module.exports = {
  AllJobs,
  DeleteJob,
  JobData,
  JobWithApplicants,
  StudentJobsApplied,
  ExportJobApplicantsCSV
};