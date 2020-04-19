const express = require('express');
const userRoutes = require('./routes/userRoutes');
const feedRoutes = require('./routes/feedRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
//parsing cookies

app.use(cookieParser());
// reading data from the req.body
app.use(express.json({ limit: '10kb' }));
app.use('/users', userRoutes);
app.use('/feed', feedRoutes);
module.exports = app;
