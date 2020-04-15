const express = require('express');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');

const app = express();

// reading data from the req.body
app.use(express.json({ limit: '10kb' }));
app.use('/users', userRoutes);

module.exports = app;
