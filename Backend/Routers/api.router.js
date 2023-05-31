const express = require("express");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const APIRouter = express.Router();
const API_KEY = process.env.API_KEY;

// Weather endpoint to get weather data based on query parameters
APIRouter.get("/weather", async (req, res) => {
  const city = req.query.city;
  const unit = req.query.unit;
  const language = req.query.language;

  // Construct the base URL for the weather API
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}`;

  // Append unit parameter if provided
  if (unit) {
    url += `&units=${unit}`;
  }

  // Append language parameter if provided
  if (language) {
    url += `&lang=${language}`;
  }

  try {
    // Fetch weather data from the constructed URL
    const response = await fetch(`${url}&key=${API_KEY}`);
    const data = await response.json();

    // Send the weather data as the response
    res.status(200).send(data);
  } catch (error) {
    // Handle any errors that occurred during the API request
    res.status(500).send(error.message);
  }
});
module.exports = { APIRouter };
