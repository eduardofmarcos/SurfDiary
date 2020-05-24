const express = require('express');
const authController = require('../controllers/authController');
const feedController = require('../controllers/feedController');

const router = express.Router();

//********************** Feed routes - Start **********************/
router.get('/myfeed', authController.protect, feedController.myFeed);
router.post(
  '/postpic',
  authController.protect,
  feedController.uploadFeed,
  feedController.resizeUserPhoto,
  feedController.postPic
);
router.delete(
  '/deletepic/:id',
  authController.protect,
  feedController.deletePic
);

//********************** Admin - Users routes - Start **********************/

module.exports = router;
