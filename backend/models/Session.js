const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a session title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a session description'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a session date']
  },
  duration: {
    type: Number,
    required: [true, 'Please add session duration in minutes'],
    default: 60
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'postponed'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String
  },
  communicationType: {
    type: String,
    enum: ['Video Call', 'Audio Call', 'Chat', 'In-person'],
    default: 'Video Call'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', SessionSchema); 