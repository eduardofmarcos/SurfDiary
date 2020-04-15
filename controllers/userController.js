const User = require('../models/User');

exports.showMyFeed = (req, res, next) => {
  res.status(200).json({ data: req.user });
};

exports.postMyPic = (req, res, next) => {
  res.send('Posted Pic');
};
exports.getMe = (req, res, next) => {
  res.send('My account');
};

exports.updateMe = (req, res, next) => {
  res.send('Update Me');
};

exports.deleteMe = (req, res, next) => {
  res.send('Delete Me');
};
