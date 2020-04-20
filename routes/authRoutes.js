const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

//********************** Auth Routes - Start **********************/
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.protect, authController.logout);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.get('/verifyaccount/:token', authController.verifyAccount);
router.get('/rtoken/:token', authController.refreshToken);
//********************** Auth Routes - End **********************/

module.exports = router;
