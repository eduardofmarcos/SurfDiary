const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Email = require('../utils/Email');
const User = require('../models/User');
const Token = require('../models/Token');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

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

//RefreshToken Handler
const blackList = []; //it will be replaced by redis
exports.refreshToken = catchAsync(async (req, res, next) => {
  const tokenToVerify = req.params.token;
  if (blackList.includes(tokenToVerify)) return next(new AppError('', 401));
  blackList.push(tokenToVerify);

  // verify the token
  const decoded = await promisify(jwt.verify)(
    tokenToVerify,
    process.env.JWT_REFRESH_SECRET
  );

  const { id } = decoded;

  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.cookie('accessToken', accessToken);

  res.status(200).json({ status: 'success', message: 'refreshed' });
});

//********************** JWT - Token Handlers - End **********************/

//********************** Email verification - Token Handlers - Start **********************/

exports.verifyAccount = catchAsync(async (req, res, next) => {
  const verificationToken = req.params.token;

  const getUserByToken = await Token.findOne({ token: verificationToken });

  if (!getUserByToken)
    return next(
      new AppError('We could not find any user with this Id :(', 404)
    );

  await User.findByIdAndUpdate(getUserByToken._userId, {
    active: true
  });

  return res.status(200).json({
    status: 'success',
    message: 'Thank you! You successfully verified your account :)'
  });
});

//********************** Email verification - Token Handlers - End **********************/
//********************** Auth Handlers - Start **********************/

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    role
  });

  // creating the verification Token to send via email
  const token = await Token.create({
    _userId: newUser._id,
    token: crypto.randomBytes(16).toString('hex')
  });
  // getting the route for user verify the account
  const urlTo = 'http://localhost:4000/auth/verifyaccount/';
  const urlToVerify = urlTo + token.token;
  //console.log(urlToVerify);
  // sendind the verification token email
  await new Email(newUser, urlToVerify).sendVerify();

  //send authentication token
  sendTokens(newUser, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // get the email and the password from req.body
  const { email, password } = req.body;
  // check if there is a email or password
  if (!email || !password)
    return next(
      new AppError('You need to provide an email and an password!', 401)
    );
  // get the user from email
  const userToLogin = await User.findOne({ email }).select('+password');
  // check if user exists
  if (!userToLogin)
    return next(new AppError('Password or user incorrect', 401));

  // compare the user password with the candidate password
  const checkedPass = await userToLogin.correctPassword(
    password,
    userToLogin.password
  );
  if (!checkedPass)
    return next(new AppError('Password or user incorrect', 401));

  //verify if the user is active:
  if (!userToLogin.active)
    return next(new AppError('You need to verify your account!', 401));

  //send authentication token
  sendTokens(userToLogin, 200, req, res);
});

exports.logout = (req, res, next) => {
  res.cookie('accessToken', 'logged out');
  res.status(200).json({ status: 'logout' });
};

//********************** Auth Handlers - End **********************/

//********************** Password Handlers - Start **********************/

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get the email to send the token to reset
  const emailToSendToken = req.body.email;
  //console.log('email from req', emailToSendToken);
  const userToResetPassword = await User.findOne({ email: emailToSendToken });
  // checking if the user exists
  if (!userToResetPassword)
    return next(new AppError('This user do not exist :(', 404));
  //console.log('user to reset', userToResetPassword);
  // generating the token to send to URL
  const tokenToSendToUrl = userToResetPassword.createResetPasswordToken();
  //console.log('token', tokenToSendToUrl);
  userToResetPassword.save({ validateBeforeSave: false });

  // trying to send the email
  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/auth/resetpassword/${tokenToSendToUrl}`;
    console.log(resetUrl);
    await new Email(userToResetPassword, resetUrl).sendResetPassword();

    return res.status(200).json({
      status: 'success',
      message: 'Email to reset your password sent :)'
    });
  } catch (error) {
    userToResetPassword.passwordResetToken = undefined;
    userToResetPassword.passwordResetExpires = undefined;
    userToResetPassword.save({ validateBeforeSave: false });

    //console.log(error);
    res.status(400).json({ error: error });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const tokenToReset = req.params.token;

  const hashToken = crypto
    .createHash('sha256')
    .update(tokenToReset)
    .digest('hex');

  const userToResetPassword = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: {
      $gt: Date.now()
    }
  });

  // if token has not been expired and there is a user to reset

  if (!userToResetPassword)
    return next(
      new AppError(
        'There is no user with this Id or the token has expired :(',
        401
      )
    );

  // if there is a user based on token and the token itself has not been expired, grant the patch
  userToResetPassword.password = req.body.password;
  userToResetPassword.confirmPassword = req.body.confirmPassword;
  userToResetPassword.passwordResetToken = undefined;
  userToResetPassword.passwordResetExpires = undefined;

  // saving the new password
  await userToResetPassword.save();

  // creating new tokens and loggin the user on app

  sendTokens(userToResetPassword, 200, req, res);
});

//********************** Password Handlers - End **********************/

//********************** Protect routes middleware - Start **********************/
exports.protect = catchAsync(async (req, res, next) => {
  const tokenToVerify = req.cookies.accessToken;

  if (!tokenToVerify)
    return next(new AppError('You do not have access to this route!', 401));

  //verify the cookie
  const decoded = await promisify(jwt.verify)(
    tokenToVerify,
    process.env.JWT_SECRET
  );

  // find a user based on decoded token
  const currentUser = await User.findOne({ _id: decoded.id });
  if (!currentUser)
    return next(new AppError('You do not have access to this route!', 401));

  // checking if is a active user
  if (!currentUser.active)
    return next(
      new AppError(
        'You need to verify your account! Or maybe your are no longer a user :(',
        401
      )
    );

  // give protected access to follow user
  req.user = currentUser;
  next();
});

//********************** Protect routes middleware - End **********************/

//********************** Restrict Roles middleware - Start **********************/

exports.restrictTo = catchAsync(async (req, res, next) => {
  const userIsAdmin = await User.findById(req.user._id);

  if (userIsAdmin.role === 'admin') {
    next();
  } else {
    return next(new AppError('You have no access to this route :(', 401));
  }
});
