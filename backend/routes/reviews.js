const express = require('express');
const {
  getReviews,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviews)
  .post(protect, authorize('mentee'), addReview);

router.route('/:id')
  .put(protect, authorize('mentee'), updateReview)
  .delete(protect, authorize('mentee', 'admin'), deleteReview);

module.exports = router; 