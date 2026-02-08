const connectDB = require('../config/MongoDB');
const mongoose = require('mongoose');

async function run() {
  await connectDB();

  try {
    const Job = require('../models/job.model');
    const User = require('../models/user.model');

    console.log('Removing status from job applicants...');
    // Remove status field from all applicants in all jobs
    await Job.updateMany({}, { $unset: { 'applicants.$[].status': '' } });

    console.log('Removing status from users appliedJobs...');
    // Remove status field from studentProfile.appliedJobs in all users
    await User.updateMany({}, { $unset: { 'studentProfile.appliedJobs.$[].status': '' } });

    console.log('Status fields removed from DB (if present).');
  } catch (err) {
    console.error('Error while removing status fields:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
