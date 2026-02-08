const mongoose = require('mongoose');
const Notice = require('../../models/notice.model');

const SendNotice = async (req, res) => {
  try {
    // Prefer authenticated user information over client provided data
    const user = req.user;
    if (!user) return res.status(401).json({ msg: 'Login Required' });

    const receiver_role = req.body.receiver_role || 'student';
    const title = req.body.title;
    const message = req.body.message;
    const sender = new mongoose.Types.ObjectId(user._id);
    const sender_role = user.role;
    const receiver = req.body.receiver ? new mongoose.Types.ObjectId(req.body.receiver) : undefined;

    const payload = { sender, sender_role, receiver_role, title, message };
    if (receiver) payload.receiver = receiver;

    await Notice.create(payload);
    return res.json({ msg: "Notice Sent Successfully!" });
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

const GetAllNotice = async (req, res) => {
  try {
    // Use authenticated user (route is protected) to return relevant notices
    const user = req.user;
    if (!user) return res.status(401).json({ msg: 'Login Required' });

    // Return notices that are either targeted to the user's role, or targeted to the specific user, or sent by the user
    // For students, exclude system-generated notices which are handled as Notifications
    const baseQuery = {
      $or: [
        { receiver_role: user.role },
        { receiver: user._id },
        { sender: user._id }
      ]
    };

    let notices = await Notice.find(baseQuery).sort({ createdAt: -1 });

    // Do not show system-generated notices targeted at students to TPO or Management users.
    // Example: student application status updates (shortlisted/selected/rejected) are
    // intended for the student only and should not appear in TPO/management notice lists.
    if (user.role === 'tpo_admin' || user.role === 'management_admin') {
      notices = notices.filter(n => !(n.sender_role === 'system' && n.receiver_role === 'student'));
    }

    return res.json(notices);
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

const GetNotice = async (req, res) => {
  try {
    // console.log(req.query.noticeId)
    const notice = await Notice.findById(req.query.noticeId);
    // console.log(notice)
    return res.json(notice);
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

const DeleteNotice = async (req, res) => {
  try {
    if (!req.query.noticeId) return res.json({ msg: "Error while deleting notice!" });
    await Notice.findByIdAndDelete(req?.query?.noticeId);
    return res.json({ msg: "Notice Deleted Successfully!" });
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

module.exports = {
  SendNotice,
  GetAllNotice,
  DeleteNotice,
  GetNotice,
};