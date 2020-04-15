const express = require('express');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const authApp = express();

authApp.use(cookieParser());
authApp.use(express.json({ limit: '10kb' }));

authApp.use('/auth', authRoutes);

module.exports = authApp;
