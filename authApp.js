const express = require("express");

const authApp = express();

app.use("/auth", authRoutes);

module.exports = authApp;
