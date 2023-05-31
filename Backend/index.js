const express = require("express");
const cors = require("cors");
const colors = require("colors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.underline.green);
});
