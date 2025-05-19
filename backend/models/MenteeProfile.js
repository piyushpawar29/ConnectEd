const mongoose = require('mongoose');

const MenteeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interests: {
    type: [String],
    required: [true, 'Please add at least one interest']
  },
  goals: {
    type: String,
    required: [true, 'Please describe your goals']
  },
  preferredLanguages: {
    type: [String],
    default: ['English']
  },
  educationLevel: {
    type: String,
    enum: ['High School', 'Undergraduate', 'Graduate', 'PhD', 'Self-taught', 'Other'],
    default: 'Other'
  },
  currentOccupation: {
    type: String
  },
  learningStyle: {
    type: String,
    enum: ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Mixed'],
    default: 'Mixed'
  },
  availableHours: {
    type: Number,
    default: 5
  },
  preferredCommunication: {
    type: String,
    enum: ['Video Call', 'Audio Call', 'Chat', 'Any'],
    default: 'Any'
  },
  sessionsTaken: {
    type: Number,
    default: 0
  },
  mentorsConnected: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MenteeProfile', MenteeProfileSchema); 