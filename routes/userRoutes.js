const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// User verbs
router.get('/myfeed', authController.protect, userController.showMyFeed);
router.get('/me', authController.protect, userController.getMe);
router.post('/postmypic', authController.protect, userController.postMyPic);
router.patch('/updateme', authController.protect, userController.updateMe);
router.delete('/deleteme', authController.protect, userController.deleteMe);

module.exports = router;
