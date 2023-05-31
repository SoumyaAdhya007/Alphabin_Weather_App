const mongoose = require("mongoose");
require("dotenv").config();

// Establish a connection to MongoDB using the provided URL from the environment variables
const connection = mongoose.connect(process.env.mongoURL);

module.exports = {
  connection,
};
