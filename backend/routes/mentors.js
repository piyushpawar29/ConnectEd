const express = require('express');
const {
  getMentors,
  getMentor,
  updateMentorProfile,
  getMentorProfile
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

router.route('/:id')
  .get(getMentor);

module.exports = router; 