const mongoose = require('mongoose');

const MentorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Please add an hourly rate']
  },
  expertise: {
    type: [String],
    required: [true, 'Please add at least one area of expertise']
  },
  languages: {
    type: [String],
    default: ['English']
  },
  experience: {
    type: String,
    required: [true, 'Please describe your experience']
  },
  availability: {
    type: String,
    default: 'Flexible'
  },
  category: {
    type: String,
    enum: ['Technology', 'Business', 'Design', 'Marketing', 'Other'],
    required: true
  },
  communicationPreference: {
    type: String,
    enum: ['Video Call', 'Audio Call', 'Chat', 'Any'],
    default: 'Any'
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  sessions: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio']
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('MentorProfile', MentorProfileSchema); 