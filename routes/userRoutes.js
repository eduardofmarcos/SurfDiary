const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

//********************** Users routes - Start **********************/
router.get('/me', authController.protect, userController.getMe);
router.patch('/updateme', authController.protect, userController.updateMe);
router.patch('/deleteme', authController.protect, userController.deleteMe);

//********************** Admin - Users routes - Start **********************/

router.get(
  '/getuser/:id',
  authController.protect,
  authController.restrictTo,
  userController.getUser
);
router.get(
  '/getallusers',
  authController.protect,
  authController.restrictTo,
  userController.getAllUsers
);
router.patch(
  '/updateuser/:id',
  authController.protect,
  authController.restrictTo,
  userController.updateUser
);
router.delete(
  '/deleteuser/:id',
  authController.protect,
  authController.restrictTo,
  userController.deleteUser
);

module.exports = router;
