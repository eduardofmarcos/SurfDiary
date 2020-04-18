const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

//********************** Users routes - Start **********************/
router.get('/me', authController.protect, userController.getMe);
router.patch('/updateme', authController.protect, userController.updateMe);
router.patch('/deleteme', authController.protect, userController.deleteMe);

//********************** Admin - Users routes - Start **********************/

router.get('/getuser/:id', userController.getUser);
router.get('/getallusers', userController.getAllUsers);
router.patch('/updateuser/:id', userController.updateUser);
router.delete('/deleteuser/:id', userController.deleteUser);

module.exports = router;
