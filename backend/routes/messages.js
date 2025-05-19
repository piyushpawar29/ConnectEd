const express = require('express');
const {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messages');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .post(protect, sendMessage);

router.route('/conversations')
  .get(protect, getConversations);

router.route('/unread')
  .get(protect, getUnreadCount);

router.route('/:userId')
  .get(protect, getMessages);

router.route('/:id')
  .delete(protect, deleteMessage);

module.exports = router; 