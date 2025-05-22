const express = require('express');
const {
  getMentors,
  getMentor,
  updateMentorProfile,
  getMentorProfile,
  getRecommendedMentors
} = require('../controllers/mentors');

const { protect, authorize } = require('../middlewares/auth');

// Include review router
const reviewRouter = require('./reviews');

const router = express.Router();

// Re-route into other resource routers
router.use('/:mentorId/reviews', reviewRouter);

router.route('/')
  .get(getMentors);

router.route('/profile')
  .get(protect, authorize('mentor'), getMentorProfile)
  .put(protect, authorize('mentor'), updateMentorProfile);

// Add explicit route for mentor availability
router.route('/profile/availability')
  .put(protect, authorize('mentor'), updateMentorProfile);

// Route for recommended mentors
router.route('/recommended/:menteeId')
  .get(protect, getRecommendedMentors);

router.route('/:id')
  .get(getMentor);

module.exports = router; 