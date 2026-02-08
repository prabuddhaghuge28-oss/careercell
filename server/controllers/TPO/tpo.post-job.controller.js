const JobSchema = require("../../models/job.model");

const PostJob = async (req, res) => {
  try {
    // Prevent management users from posting/updating jobs
    if (req.user && req.user.role === 'management_admin') {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    const company = req.body.company;
    const jobTitle = req.body.jobTitle;
    const jobDescription = req.body.jobDescription;
    const eligibility = req.body.eligibility;
    const salary = req.body.salary;
    const howToApply = req.body.howToApply;
    const applicationDeadline = req.body.applicationDeadline;


    // console.log(newJob);

    if (!jobTitle || !jobDescription || !eligibility || !company) {
      return res.status(400).json({ msg: 'Job title, job description, eligibility and company name are required.' });
    }

    const job = await JobSchema.findById(req.body._id);

    // check for duplicate job title for the same company (case-insensitive)
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titleRegex = new RegExp(`^${escapeRegex((jobTitle || '').trim())}$`, 'i');
    const existingJob = await JobSchema.findOne({ company, jobTitle: { $regex: titleRegex } });

    if (job) {
      // updating an existing job: ensure no other job (different id) has same title
      if (existingJob && existingJob._id.toString() !== job._id.toString()) {
        return res.status(400).json({ msg: 'A job with the same title already exists for this company.' });
      }
      await job.updateOne({
        company,
        jobTitle,
        jobDescription,
        eligibility,
        salary,
        howToApply,
        applicationDeadline
      });
      res.status(201).json({ msg: 'Job Updated successfully' });
    } else {
      // creating a new job: reject if duplicate title exists for same company
      if (existingJob) {
        return res.status(400).json({ msg: 'A job with the same title already exists for this company.' });
      }

      const newJob = new JobSchema({
        jobTitle,
        jobDescription,
        eligibility,
        salary,
        howToApply,
        postedAt: new Date(),
        applicationDeadline,
        company
      });
      await newJob.save();
      return res.status(201).json({ msg: 'Job posted successfully' });
    }

  } catch (error) {
    console.log("tpo.post-job.controller.js => ", error);
    return res.status(500).json({ msg: 'Server error', error: error });
  }
}

module.exports = PostJob;