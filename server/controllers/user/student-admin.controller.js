const User = require('../../models/user.model');

const ensureManagementOrTPO = (req, res) => {
  const allowedRoles = ['management_admin', 'tpo_admin'];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    res.status(403).json({ msg: 'Forbidden' });
    return false;
  }
  return true;
};

const normalizeEmail = (email) => email?.trim().toLowerCase();

const listStudentUsers = async (req, res) => {
  if (!ensureManagementOrTPO(req, res)) return;

  try {
    const studentUsers = await User.find({ role: 'student' }).select('-password');
    return res.json({ studentUsers });
  } catch (error) {
    console.log('student-admin.controller.js => listStudentUsers', error);
    return res.status(500).json({ msg: 'Internal Server Error!' });
  }
};

const deleteStudentUser = async (req, res) => {
  if (!ensureManagementOrTPO(req, res)) return;

  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) return res.status(400).json({ msg: 'Email is required' });

    const user = await User.findOne({ email, role: 'student' });
    if (!user) return res.status(404).json({ msg: "Student user doesn't exist!" });

    await user.deleteOne();
    return res.json({ msg: 'Student deleted successfully' });
  } catch (error) {
    console.log('student-admin.controller.js => deleteStudentUser', error);
    return res.status(500).json({ msg: 'Internal Server Error!' });
  }
};

const approveStudentUser = async (req, res) => {
  if (!ensureManagementOrTPO(req, res)) return;

  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) return res.status(400).json({ msg: 'Email is required' });

    const user = await User.findOne({ email, role: 'student' });
    if (!user) return res.status(404).json({ msg: "Student user doesn't exist!" });

    if (!user.studentProfile) user.studentProfile = {};
    user.studentProfile.isApproved = true;
    await user.save();

    return res.json({ msg: 'Student approved successfully' });
  } catch (error) {
    console.log('student-admin.controller.js => approveStudentUser', error);
    return res.status(500).json({ msg: 'Internal Server Error!' });
  }
};

const getStudentUserById = async (req, res) => {
  if (!ensureManagementOrTPO(req, res)) return;

  try {
    const { studentId } = req.params;
    if (!studentId) return res.status(400).json({ msg: 'Student ID is required' });

    const user = await User.findOne({ _id: studentId, role: 'student' }).select('-password');
    if (!user) return res.status(404).json({ msg: "Student user doesn't exist!" });

    return res.json(user);
  } catch (error) {
    console.log('student-admin.controller.js => getStudentUserById', error);
    return res.status(500).json({ msg: 'Internal Server Error!' });
  }
};

module.exports = {
  listStudentUsers,
  deleteStudentUser,
  approveStudentUser,
  getStudentUserById,
};

