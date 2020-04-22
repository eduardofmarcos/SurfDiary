const AppError = require('../utils/AppError');

//********************** Errors handlers functions - Start **********************/
const handleCastErrorDb = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //console.log('this is the VALuueeee ,', value);
  const message = `Duplicate field value: ${value} please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const msgErrorArray = Object.values(err.errors).map(el => el.message);
  const message = `Invalid fields ${msgErrorArray.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTerror = err => {
  if (err.name === 'JsonWebTokenError')
    return new AppError('Invalid token. Please log in again', 401);
  if (err.name === 'TokenExpiredError')
    return new AppError('Expired token. Please log in again', 401);
};

//********************** Errors handlers functions - End **********************/

//********************** Errors sending functions - Start **********************/
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //untrusted error - generic message

    console.error('***** ERROR *****', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong :('
    });
  }
};
//********************** Errors sending functions - End **********************/

//********************** Errors exporting - Start **********************/
module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTerror(error);
    if (error.name === 'TokenExpiredError') error = handleJWTerror(error);
    sendErrorProd(error, res);
  }
};
//********************** Errors exporting - Start **********************/
