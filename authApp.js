const express = require('express');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const authApp = express();

authApp.use(cookieParser());
authApp.use(express.json({ limit: '10kb' }));

authApp.use('/auth', authRoutes);

authApp.use('*', (req, res, next) => {
  next(new AppError('Can not find this route on this server :(', 400));
});

//by using four parameters, express automatically out of box know this is a erro handling middleware
authApp.use(globalErrorHandler);

module.exports = authApp;
