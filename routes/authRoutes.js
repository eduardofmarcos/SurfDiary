const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.protect, authController.logout);
router.post(
  '/forgotpassword',
  authController.protect,
  authController.forgotPassword
);
router.patch('/resetpassword/:token', authController.resetPassword);

module.exports = router;
