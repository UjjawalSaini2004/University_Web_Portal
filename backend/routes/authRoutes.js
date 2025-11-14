const express = require('express');
const router = express.Router();
const {
  register,
  registerAdmin,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updatePassword,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validator');

// Public routes
router.post('/register', registerValidation, register);
router.post('/register-admin', registerAdmin);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/update-password', authenticate, updatePassword);

module.exports = router;
