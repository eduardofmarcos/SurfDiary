const express = require('express');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
//parsing cookies

app.use(cookieParser());
// reading data from the req.body
app.use(express.json({ limit: '10kb' }));
app.use('/users', userRoutes);

module.exports = app;
