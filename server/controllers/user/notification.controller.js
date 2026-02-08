// Notification controller removed during revert.
// These handlers return 404 to indicate notifications API is disabled.
const GetNotifications = async (req, res) => {
  return res.status(404).json({ msg: 'Notifications API removed. Use notices instead.' });
}

const GetNotification = async (req, res) => {
  return res.status(404).json({ msg: 'Notifications API removed. Use notices instead.' });
}

module.exports = {
  GetNotifications,
  GetNotification
};
