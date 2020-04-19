const User = require('../models/User');

//********************** Users Handlers - Start **********************/

exports.getMe = async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  res.status(200).json({ status: 'success', data: currentUser });
};

exports.updateMe = async (req, res, next) => {
  const { name, email } = req.body;
  const currentUser = await User.findByIdAndUpdate(req.user._id, {
    name,
    email
  });

  res.status(200).json({ status: 'success', data: currentUser });
};

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false
  });

  res
    .status(200)
    .json({ status: 'success', message: 'You desativated your account!' });
};

//********************** Users Handlers - End **********************/

//********************** Admin - Users Handlers - Start **********************/

exports.getUser = async (req, res, next) => {
  const idUserToGet = req.params.id;

  const userToGet = await User.findById(idUserToGet);

  res.status(200).json({ status: 'success', data: userToGet });
};

exports.getAllUsers = async (req, res, next) => {
  const AllUsers = await User.find();

  res.status(200).json({ status: 'success', data: AllUsers });
};

exports.updateUser = async (req, res, next) => {
  const idUserToGet = req.params.id;
  const dataToUpdate = req.body;

  const userUpdated = await User.findByIdAndUpdate(idUserToGet, dataToUpdate);

  res.status(200).json({ status: 'success', data: userUpdated });
};

exports.deleteUser = async (req, res, next) => {
  const idUserToGet = req.params.id;

  await User.findByIdAndDelete(idUserToGet);

  res.status(204).json({});
};

//********************** Admin - Users Handlers - End **********************/
