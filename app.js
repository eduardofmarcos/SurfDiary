const express = require('express');
const userRoutes = require('./routes/userRoutes');
const feedRoutes = require('./routes/feedRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const globalError = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();
//parsing cookies

app.use(cookieParser());
// reading data from the req.body
app.use(express.json({ limit: '10kb' }));
app.use('/users', userRoutes);
app.use('/feed', feedRoutes);

app.use('*', (req, res, next) => {
  next(new AppError('Can not find this route on this server :(', 400));
});

//by using four parameters, express automatically out of box know this is a erro handling middleware
app.use(globalError);
module.exports = app;
