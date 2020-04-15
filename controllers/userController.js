const User = require('./../models/User');

exports.getMe = (req, res, next) => {
  res.send('My account');
};

exports.updateMe = (req, res, next) => {
  res.send('Update Me');
};

exports.deleteMe = (req, res, next) => {
  res.send('Delete Me');
};
