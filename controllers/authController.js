const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { promisify } = require('util');
const Email = require('./../utils/Email');

//********************** JWT - Token Handlers - Start **********************/
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const refreshSignToken = id => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  });
};

const sendTokens = (user, statusCode, req, res) => {
  const accessToken = signToken(user._id);
  const refreshToken = refreshSignToken(user._id);
  //console.log(accessToken);
  //console.log(refreshToken);
  res.cookie('accessToken', accessToken, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    sameSite: 'none',
    httpOnly: false
    //secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  res.locals.refreshSignToken = refreshToken;

  res.status(statusCode).json({
    user,
    accessToken,
    refreshToken
  });
};

//********************** JWT - Token Handlers - End **********************/

//********************** Auth Handlers - Start **********************/

exports.signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword
  });

  res.status(201).json({
    status: 'success',
    data: newUser
  });
};

exports.login = async (req, res, next) => {
  // get the email and the password from req.body
  const { email, password } = req.body;
  // check if there is a email or password
  if (!email || !password)
    return res
      .status(400)
      .json({ status: 'You need to provide an email and an password!' });
  // get the user from email
  const userToLogin = await User.findOne({ email }).select('+password');
  // check if user exists
  if (!userToLogin)
    return res.status(401).json({ status: 'Email or Password incorrect!' });

  // compare the user password with the candidate password
  const checkedPass = await userToLogin.correctPassword(
    password,
    userToLogin.password
  );
  if (!checkedPass)
    return res.status(401).json({ status: 'Email or Password incorrect!' });
  //send authentication token
  sendTokens(userToLogin, 200, req, res);
};

exports.logout = (req, res, next) => {
  res.cookie('accessToken', 'logged out');
  res.status(200).json({ status: 'logout' });
};

//********************** Auth Handlers - End **********************/

//********************** Password Handlers - Start **********************/

exports.forgotPassword = async (req, res, next) => {
  // get the email to send the token to reset
  const emailToSendToken = req.body.email;
  console.log('email from req', emailToSendToken);
  const userToResetPassword = await User.findOne({ email: emailToSendToken });
  // checking if the user exists
  if (!userToResetPassword)
    return res
      .status(400)
      .json({ status: 'Fail', message: 'This user does not exist!' });
  console.log('user to reset', userToResetPassword);
  // generating the token to send to URL
  const tokenToSendToUrl = userToResetPassword.createResetPasswordToken();
  console.log('token', tokenToSendToUrl);
  userToResetPassword.save({ validateBeforeSave: false });

  // trying to send the email
  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/auth/resetpassword/${tokenToSendToUrl}`;
    console.log(resetUrl);
    await new Email(userToResetPassword, resetUrl).sendTheEmail();

    return res.status(200).json({
      status: 'success',
      message: 'Email to reset your password sent :)'
    });
  } catch (error) {
    userToResetPassword.passwordResetToken = undefined;
    userToResetPassword.passwordResetExpires = undefined;
    userToResetPassword.save({ validateBeforeSave: false });

    console.log(error);
    res.status(400).json({ error: error });
  }
};

exports.resetPassword = (req, res, next) => {
  res.send('Post your new password');
};

// Protect Middleware
exports.protect = async (req, res, next) => {
  const tokenToVerify = req.cookies.accessToken;

  // check if there is a access token
  if (!tokenToVerify)
    return res
      .status(401)
      .json({ status: 'You do not have access to this route:)' });

  //verify the cookie
  const decoded = await promisify(jwt.verify)(
    tokenToVerify,
    process.env.JWT_SECRET
  );

  // find a user based on decoded token
  const currentUser = await User.findOne({ _id: decoded.id });
  if (!currentUser)
    return res
      .status(401)
      .json({ status: 'You do not have access to this route:)' });

  // give protected access to follow user
  req.user = currentUser;
  next();
};

//********************** Password Handlers - End **********************/
