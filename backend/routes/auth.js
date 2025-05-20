const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword
} = require('../controllers/auth');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API connection test successful',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 