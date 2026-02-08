const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  // sender is optional to allow system-generated notices (no human sender)
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  // include 'system' role for system-generated notices
  sender_role: { type: String, enum: ['student', 'tpo_admin', 'management_admin', 'system'], required: true },
  receiver_role: { type: String, enum: ['student', 'tpo_admin', 'management_admin'], required: true },
  title: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema,'notices');
