const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

//********************** Users Handlers - Start **********************/

exports.getMe = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  res.status(200).json({ status: 'success', data: currentUser });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const dataToUpdate = req.body;
  const currentUser = await User.findByIdAndUpdate(req.user._id, dataToUpdate);

  res.status(200).json({ status: 'success', data: currentUser });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false
  });

  res
    .status(200)
    .json({ status: 'success', message: 'You desativated your account!' });
});

//********************** Users Handlers - End **********************/

//********************** Admin - Users Handlers - Start **********************/

exports.getUser = catchAsync(async (req, res, next) => {
  const idUserToGet = req.params.id;

  const userToGet = await User.findById(idUserToGet);

  if (!userToGet)
    return next(new AppError('There is no user with this Id :(', 404));

  res.status(200).json({ status: 'success', data: userToGet });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const AllUsers = await User.find();

  res.status(200).json({ status: 'success', data: AllUsers });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const idUserToGet = req.params.id;
  const dataToUpdate = req.body;

  const userUpdated = await User.findByIdAndUpdate(idUserToGet, dataToUpdate);

  if (!userUpdated)
    return next(new AppError('There is no user with this Id :(', 404));

  res.status(200).json({ status: 'success', data: userUpdated });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const idUserToGet = req.params.id;

  const userToDelete = await User.findByIdAndDelete(idUserToGet);

  if (!userToDelete)
    return next(new AppError('There is no user with this Id :(', 404));
  res.status(204).json({});
});

//********************** Admin - Users Handlers - End **********************/
