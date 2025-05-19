const express = require('express');
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  updateSessionStatus
} = require('../controllers/sessions');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(protect, getSessions)
  .post(protect, createSession);

router.route('/:id')
  .get(protect, getSession)
  .put(protect, updateSession)
  .delete(protect, deleteSession);

router.route('/:id/status')
  .put(protect, updateSessionStatus);

module.exports = router; 