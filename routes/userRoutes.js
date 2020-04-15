const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// User verbs
router.get('/me', userController.getMe);
router.patch('/updateme', userController.updateMe);
router.delete('/deleteme', userController.deleteMe);

module.exports = router;
