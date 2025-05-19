const express = require('express');
const {
  getMenteeProfile,
  updateMenteeProfile,
  connectWithMentor,
  disconnectFromMentor,
  getConnectedMentors
} = require('../controllers/mentees');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/profile')
  .get(protect, authorize('mentee'), getMenteeProfile)
  .put(protect, authorize('mentee'), updateMenteeProfile);

router.route('/mentors')
  .get(protect, authorize('mentee'), getConnectedMentors);

router.route('/connect/:mentorId')
  .post(protect, authorize('mentee'), connectWithMentor);

router.route('/disconnect/:mentorId')
  .delete(protect, authorize('mentee'), disconnectFromMentor);

module.exports = router; 