const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add message text'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  attachment: {
    type: String
  },
  attachmentType: {
    type: String,
    enum: ['image', 'document', 'link', 'none'],
    default: 'none'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for performance
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema); 