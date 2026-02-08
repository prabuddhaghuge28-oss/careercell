const express = require('express');

// router after /api/v1/tpo/
const router = express.Router();

const authenticateToken = require('../middleware/auth.middleware');


// tpo login controller
const Login = require('../controllers/TPO/tpo.login.controller');

const PostJob = require('../controllers/TPO/tpo.post-job.controller');

// reuse Management notice controller so TPO can send notices too
const { SendNotice } = require('../controllers/Management/notice.controller');

const { AllJobs, DeleteJob, JobData, JobWithApplicants, StudentJobsApplied, ExportJobApplicantsCSV } = require('../controllers/user/user.all-jobs.controller');
const { UpdateJobStatus } = require('../controllers/Student/update-job-status.controller.js');
const {
	listStudentUsers,
	deleteStudentUser,
	approveStudentUser,
	getStudentUserById,
} = require('../controllers/user/student-admin.controller');

// login post request for student
router.post('/login', Login);


// post job listing data
router.post('/post-job', authenticateToken, PostJob);

// all jobs 
router.get('/jobs', AllJobs);

// delete job 
router.post('/delete-job', authenticateToken, (req, res, next) => {
	const user = req.user;
	if (!user) return res.status(401).json({ msg: 'Login Required' });
	if (['tpo_admin', 'management_admin'].includes(user.role)) return next();
	return res.status(403).json({ msg: 'Forbidden' });
}, DeleteJob);

// view a job 
router.get('/job/:jobId', authenticateToken, JobData);

// job with its applicants 
router.get('/job/applicants/:jobId', authenticateToken, JobWithApplicants)
// export applicants csv
router.get('/job/applicants/:jobId/export', authenticateToken, ExportJobApplicantsCSV)

// allow TPO/admin to update a student's job status
const ensureAdminOrTPO = (req, res, next) => {
	const user = req.user;
	if (!user) return res.status(401).json({ msg: 'Login Required' });
	// Only TPO admins (not management) may perform this action
	if (['tpo_admin'].includes(user.role)) return next();
	return res.status(403).json({ msg: 'Forbidden' });
}

router.post('/job/update-status/:jobId/:studentId', authenticateToken, ensureAdminOrTPO, UpdateJobStatus);

// student jobs applied 
router.get('/myjob/:studentId', authenticateToken, StudentJobsApplied)

router.get('/student-users', authenticateToken, listStudentUsers);
router.post('/student-delete-user', authenticateToken, deleteStudentUser);
router.post('/student-approve', authenticateToken, approveStudentUser);
router.get('/student/:studentId', authenticateToken, getStudentUserById);

// allow TPO to send notices (uses same controller as management)
router.post('/send-notice', authenticateToken, SendNotice);


module.exports = router;