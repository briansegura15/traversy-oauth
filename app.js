const express = require("express");
const dotenv = require("dotenv");

// Load config
dotenv.config({path: "./config/config.env"});

const app = express();

const PORT = process.env.PORT || 8500;

app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);
