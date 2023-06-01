// Define the base URL for API requests
const BaseURL = "https://alphabin-weather-app-backend.onrender.com/api/";

// Get the authentication token from local storage
const token = localStorage.getItem("weather-app-login-token");

// Function to extract date and time from a timestamp
function timestampExtractFun(timestamp) {
  const date = new Date(timestamp * 1000); // Multiply by 1000 as the timestamp is in seconds

  // Get day information
  const dayNumber = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = dayNames[dayNumber];

  // Get time information
  const today_date = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let timePeriod = "AM";
  let formattedHours = hours;

  if (hours > 12) {
    timePeriod = "PM";
    formattedHours = hours - 12;
  } else if (hours === 0) {
    formattedHours = 12;
  }

  // Format time
  const formattedTime = `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${timePeriod}`;

  // Get month and year information
  const monthIndex = date.getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[monthIndex];
  const year = date.getFullYear();

  // Create and return an object with date and time information
  let obj = {
    day: dayName,
    time: formattedTime,
    date: today_date,
    month: monthName,
    year: year,
  };

  return obj;
}

// Function to get the day name from a timestamp
function gateDateFun(timestamp) {
  const date = new Date(timestamp * 1000); // Multiply by 1000 as the timestamp is in seconds

  const dayNumber = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = dayNames[dayNumber];

  return dayName;
}
// Object mapping weather codes to corresponding icons
const weatherIcons = {
  200: "fas fa-bolt", // Thunderstorm with light rain
  201: "fas fa-bolt", // Thunderstorm with rain
  202: "fas fa-bolt", // Thunderstorm with heavy rain
  230: "fas fa-bolt", // Thunderstorm with light drizzle
  231: "fas fa-bolt", // Thunderstorm with drizzle
  232: "fas fa-bolt", // Thunderstorm with heavy drizzle
  233: "fas fa-bolt", // Thunderstorm with Hail
  300: "fas fa-cloud-drizzle", // Light Drizzle
  301: "fas fa-cloud-drizzle", // Drizzle
  302: "fas fa-cloud-showers-heavy", // Heavy Drizzle
  500: "fas fa-cloud-rain", // Light Rain
  501: "fas fa-cloud-rain", // Moderate Rain
  502: "fas fa-cloud-showers-heavy", // Heavy Rain
  511: "fas fa-cloud-meatball", // Freezing rain
  520: "fas fa-cloud-showers", // Light shower rain
  521: "fas fa-cloud-showers", // Shower rain
  522: "fas fa-cloud-showers-heavy", // Heavy shower rain
  600: "fas fa-snowflake", // Light snow
  601: "fas fa-snowflake", // Snow
  602: "fas fa-snowflake", // Heavy Snow
  610: "fas fa-snowflake", // Mix snow/rain
  611: "fas fa-snowflake", // Sleet
  612: "fas fa-snowflake", // Heavy sleet
  621: "fas fa-snowflake", // Snow shower
  622: "fas fa-snowflake", // Heavy snow shower
  623: "fas fa-snowflake", // Flurries
  700: "fas fa-smog", // Mist
  711: "fas fa-smog", // Smoke
  721: "fas fa-smog", // Haze
  731: "fas fa-smog", // Sand/dust
  741: "fas fa-smog", // Fog
  751: "fas fa-smog", // Freezing Fog
  800: "fas fa-sun", // ${ data.data[0].weather.description}
  801: "fas fa-cloud-sun", // Few clouds
  802: "fas fa-cloud", // Scattered clouds
  803: "fas fa-cloud", // Broken clouds
  804: "fas fa-cloud", // Overcast clouds
  900: "fas fa-question", // Unknown Precipitation
};
// Object mapping unit preference codes to corresponding units
const units = {
  M: ["C", "m/s", "mm"], // Metric units
  S: ["K", "m/s", "mm"], // Scientific units
  I: ["F", "mph", "in"], // Imperial units
};
// Define initial temperature and wind speed units
let temperatureUnit = units[document.getElementById("unitSelect").value][0];
let windSpeedUnit = units[document.getElementById("unitSelect").value][1];

// Get the search button element
const search = document.querySelector(".fa-solid.fa-magnifying-glass");
search.addEventListener("click", () => {
  // Get the city input value
  const city = document.getElementById("search").value;
  if (city === "") {
    return Swal.fire("Please enter a city name");
  }
  fetchFun(city); // Call the fetchFun function to fetch weather data
});

// Get the save preference button element
const savePreference = document.getElementById("save-preference");
savePreference.addEventListener("click", async () => {
  try {
    const city = document.getElementById("search").value;
    console.log(city);
    if (city === "") {
      return Swal.fire("Please enter a city name");
    }
    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Please Create a Account or Login to Your Account to save preference",
      });
    }
    const unit = document.getElementById("unitSelect").value;
    const language = document.getElementById("languageSelect").value;
    temperatureUnit = units[unit][0]; // Update the temperature unit based on user preference
    windSpeedUnit = units[unit][1]; // Update the wind speed unit based on user preference
    fetchFun(city, unit, language); // Call the fetchFun function to fetch weather data with updated preferences
    const obj = {
      unitPreference: unit,
      languagePreference: language,
    };
    const response = await fetch(`${BaseURL}addPreference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(obj),
    });
    if (response.ok) {
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Preference saved",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const data = await response.json();
      Swal.fire({
        position: "top",
        icon: "error",
        title: data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Fetch weather data from the API
async function fetchFun(city, unit, language) {
  try {
    const response = await fetch(
      `${BaseURL}weather?city=${city}&units=${unit}&lang=${language}`
    );
    const data = await response.json();
    renderFun(data); // Call the renderFun function to display the weather data
    if (token) {
      savedLocationFetchFun(); // Call the savedLocationFetchFun function to fetch saved locations if user is logged in
    }
  } catch (error) {
    console.log(error);
  }
}

const weather_div = document.getElementById("weather-div");
// Get the element with the ID "weather-div"

function renderFun(data) {
  weather_div.innerHTML = "";
  // Clear the inner HTML of the "weather_div" element

  const time = timestampExtractFun(data.data[0].ts);
  // Extract the timestamp from the location data and pass it to the "timestampExtractFun" function

  let allData = `<div class="weather-child-div">
    <button id="save-location" data-id=${data.city_name}>SAVE LOCATION</button>
    <h1 class="heading">Weather Forecast</h1>
    <div class="forecat-div">
      <div class="current-day">
        <div class="current-day-left-div">
          <div class="weather__body">
            <h1 class="weather__city">${data.city_name}</h1>
            <div class="weather__datetime">
              ${time.day}, ${time.month} ${time.date}, ${time.year} at ${
    time.time
  }
            </div>
            <div class="weather__forecast">${
              data.data[0].weather.description
            }</div>
            <div class="weather__icon"><i class="${
              weatherIcons[data.data[0].weather.code]
            }"></i></div>
            <p class="weather__temperature">${
              data.data[0].temp
            }&deg;<span>${temperatureUnit}</span></p>
            <div class="weather__minmax">
              <p>Min: ${
                data.data[0].max_temp
              }&deg;<span>${temperatureUnit}</span></p>
              <p>Max: ${
                data.data[0].min_temp
              }&deg;<span>${temperatureUnit}</span></p>
            </div>
          </div>
        </div>
        <div class="current-day-right-div">
          <div class="weather__card">
            <i class="fa-solid fa-temperature-full"></i>
            <div>
              <p>Real Feel</p>
              <p class="weather__realfeel">${
                data.data[0].app_max_temp
              }&deg;<span>${temperatureUnit}</span></p>
            </div>
          </div>
          <div class="weather__card">
            <i class="fa-solid fa-droplet"></i>
            <div>
              <p>Humidity</p>
              <p class="weather__humidity">${data.data[0].rh}%</p>
            </div>
          </div>
          <div class="weather__card">
            <i class="fa-solid fa-wind"></i>
            <div>
              <p>Wind</p>
              <p class="weather__wind">${
                data.data[0].wind_spd
              } ${windSpeedUnit}</p>
            </div>
          </div>
          <div class="weather__card">
            <i class="fa-solid fa-gauge-high"></i>
            <div>
              <p>Pressure</p>
              <p class="weather__pressure">${data.data[0].slp}hPa</p>
            </div>
          </div>
        </div>
      </div>
      <div class="future-days-div">
        <div class="future-days-child-div">
          <h2>${gateDateFun(data.data[1].ts)}</h2>
          <i class="${weatherIcons[data.data[1].weather.code]}"></i>
          <p>${data.data[1].weather.description}</p>
          <h2>${data.data[1].temp}&deg;<span>${temperatureUnit}</span></h2>
        </div>
        <div class="future-days-child-div">
          <h2>${gateDateFun(data.data[2].ts)}</h2>
          <i class="${weatherIcons[data.data[2].weather.code]}"></i>
          <p>${data.data[2].weather.description}</p>
          <h2>${data.data[2].temp}&deg;<span>${temperatureUnit}</span></h2>
        </div>
        <div class="future-days-child-div">
          <h2>${gateDateFun(data.data[3].ts)}</h2>
          <i class="${weatherIcons[data.data[3].weather.code]}"></i>
          <p>${data.data[3].weather.description}</p>
          <h2>${data.data[3].temp}&deg;<span>${temperatureUnit}</span></h2>
        </div>
        <div class="future-days-child-div">
          <h2>${gateDateFun(data.data[4].ts)}</h2>
          <i class="${weatherIcons[data.data[4].weather.code]}"></i>
          <p>${data.data[4].weather.description}</p>
          <h2>${data.data[4].temp}&deg;<span>${temperatureUnit}</span></h2>
        </div>
        <div class="future-days-child-div">
          <h2>${gateDateFun(data.data[5].ts)}</h2>
          <i class="${weatherIcons[data.data[5].weather.code]}"></i>
          <p>${data.data[5].weather.description}</p>
          <h2>${data.data[5].temp}&deg;<span>${temperatureUnit}</span></h2>
        </div>
        <div class="future-days-child-div">
          <h2>${gateDateFun(data.data[6].ts)}</h2>
          <i class="${weatherIcons[data.data[6].weather.code]}"></i>
          <p>${data.data[6].weather.description}</p>
          <h2>${data.data[6].temp}&deg;<span>${temperatureUnit}</span></h2>
        </div>
      </div>
    </div>
  </div>`;
  weather_div.innerHTML = allData;
  // Set the inner HTML of the "weather_div" element to the generated HTML

  let saveBtn = document.getElementById("save-location");
  // Get the element with the ID "save-location"

  saveBtn.addEventListener("click", async (event) => {
    // Add a click event listener to the "saveBtn" element
    try {
      if (!token) {
        // Check if the "token" variable is falsy (empty or undefined)
        await Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Please Create an Account or Login to Your Account to save Location",
        });
        // Show a Swal (SweetAlert) notification informing the user to create an account or login
        return (window.location.href = "signIn_signUp.html");
        // Redirect the user to the "signIn_signUp.html" page
      }

      const location = event.target.dataset.id;
      // Get the location data from the "data-id" attribute of the clicked element

      let obj = {
        location,
      };
      // Create an object with the location data

      const response = await fetch(`${BaseURL}addLocation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(obj),
      });
      // Send a POST request to add the location to the user's saved locations

      const data = await response.json();
      // Parse the response data as JSON

      if (response.ok) {
        // Check if the response status is within the successful range (200-299)
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Location saved",
          showConfirmButton: false,
          timer: 1500,
        });
        // Show a Swal (SweetAlert) success notification indicating that the location is saved
        savedLocationFetchFun();
        // Fetch the updated saved locations
      } else {
        Swal.fire({
          position: "top",
          icon: "error",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        // Show a Swal (SweetAlert) error notification with the error message from the response data
      }
    } catch (error) {
      console.log(error);
      // Log any errors that occur during the execution of the code
    }
  });
}

const saved_locations_div = document.getElementById("saved-locations-div");
const all_saved_location_div = document.getElementById(
  "all-saved-location-div"
);
// Get the elements with the IDs "saved-locations-div" and "all-saved-location-div"

async function savedLocationFetchFun() {
  try {
    if (!token) {
      // Check if the "token" variable is falsy (empty or undefined)
      return (saved_locations_div.style.display = none);
      // Set the display style of the "saved_locations_div" element to "none"
    }

    const response = await fetch(`${BaseURL}userdetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    // Send a POST request to the server to fetch user details using the token for authorization

    const data = await response.json();
    // Parse the response data as JSON

    if (response.ok) {
      // Check if the response status is within the successful range (200-299)

      if (data.savedLocations.length === 0) {
        // Check if the user has no saved locations
        return (saved_locations_div.style.display = none);
        // Set the display style of the "saved_locations_div" element to "none"
      }

      saved_locations_div.style.display = "block";
      // Set the display style of the "saved_locations_div" element to "block"

      let locationArr = [];
      // Create an empty array to store location data

      const unit = data.preferences.unitPreference;
      // Get the unit preference from the user's data

      await Promise.all(
        // Use Promise.all to wait for all promises to resolve
        data.savedLocations.map(async (item) => {
          try {
            const response = await fetch(
              `${BaseURL}weather?city=${item}&units=${data.preferences.unitPreference}&lang=${data.preferences.languagePreference}`
            );
            // Send a GET request to fetch weather data for each saved location

            if (response.ok) {
              // Check if the response status is within the successful range (200-299)
              const location = await response.json();
              // Parse the response data as JSON

              locationArr.push(location);
              // Push the location data to the "locationArr" array
            }
          } catch (error) {
            console.log(error);
            // Log any errors that occur during the execution of the code
          }
        })
      );

      renderSaveLocations(locationArr, unit);
      // Call the "renderSaveLocations" function with the location data and unit preference
    } else {
      saved_locations_div.style.display = none;
      // Set the display style of the "saved_locations_div" element to "none"
      Swal.fire(data.message);
      // Display a Swal (SweetAlert) notification with the error message from the response data
    }
  } catch (error) {
    console.log(error);
    // Log any errors that occur during the execution of the code
  }
}

savedLocationFetchFun();

function renderSaveLocations(locationArr, unit) {
  all_saved_location_div.innerHTML = "";
  // Clear the inner HTML of the "all_saved_location_div" element

  const allLocations = locationArr.map((data) => {
    const time = timestampExtractFun(data.data[0].ts);
    return `<div class="weather-child-div">
      <button class="remove-location" data-id=${
        data.city_name
      }>REMOVE LOCATION</button>
      <h1 class="heading">Weather Forecast</h1>
      <div class="forecat-div">
        <div class="current-day">
          <div class="current-day-left-div">
            <div class="weather__body">
              <h1 class="weather__city">${data.city_name}</h1>
              <div class="weather__datetime">
                ${time.day}, ${time.month} ${time.date}, ${time.year} at ${
      time.time
    }
              </div>
              <div class="weather__forecast">${
                data.data[0].weather.description
              }</div>
              <div class="weather__icon"><i class="${
                weatherIcons[data.data[0].weather.code]
              }"></i></div>
              <p class="weather__temperature">${data.data[0].temp}&deg;<span>${
      units[unit][0]
    }</span></p>
              <div class="weather__minmax">
                <p>Min: ${data.data[0].max_temp}&deg;<span>${
      units[unit][0]
    }</span></p>
                <p>Max: ${data.data[0].min_temp}&deg;<span>${
      units[unit][0]
    }</span></p>
              </div>
            </div>
          </div>
          <div class="current-day-right-div">
            <div class="weather__card">
              <i class="fa-solid fa-temperature-full"></i>
              <div>
                <p>Real Feel</p>
                <p class="weather__realfeel">${
                  data.data[0].app_max_temp
                }&deg;<span>${units[unit][0]}</span></p>
              </div>
            </div>
            <div class="weather__card">
              <i class="fa-solid fa-droplet"></i>
              <div>
                <p>Humidity</p>
                <p class="weather__humidity">${data.data[0].rh}%</p>
              </div>
            </div>
            <div class="weather__card">
              <i class="fa-solid fa-wind"></i>
              <div>
                <p>Wind</p>
                <p class="weather__wind">${data.data[0].wind_spd} ${
      units[unit][1]
    }</p>
              </div>
            </div>
            <div class="weather__card">
              <i class="fa-solid fa-gauge-high"></i>
              <div>
                <p>Pressure</p>
                <p class="weather__pressure">${data.data[0].slp}hPa</p>
              </div>
            </div>
          </div>
        </div>
        <div class="future-days-div">
          <div class="future-days-child-div">
            <h2>${gateDateFun(data.data[1].ts)}</h2>
            <i class="${weatherIcons[data.data[1].weather.code]}"></i>
            <p>${data.data[1].weather.description}</p>
            <h2>${data.data[1].temp}&deg;<span>${units[unit][0]}</span></h2>
          </div>
          <div class="future-days-child-div">
            <h2>${gateDateFun(data.data[2].ts)}</h2>
            <i class="${weatherIcons[data.data[2].weather.code]}"></i>
            <p>${data.data[2].weather.description}</p>
            <h2>${data.data[2].temp}&deg;<span>${units[unit][0]}</span></h2>
          </div>
          <div class="future-days-child-div">
            <h2>${gateDateFun(data.data[3].ts)}</h2>
            <i class="${weatherIcons[data.data[3].weather.code]}"></i>
            <p>${data.data[3].weather.description}</p>
            <h2>${data.data[3].temp}&deg;<span>${units[unit][0]}</span></h2>
          </div>
          <div class="future-days-child-div">
            <h2>${gateDateFun(data.data[4].ts)}</h2>
            <i class="${weatherIcons[data.data[4].weather.code]}"></i>
            <p>${data.data[4].weather.description}</p>
            <h2>${data.data[4].temp}&deg;<span>${units[unit][0]}</span></h2>
          </div>
          <div class="future-days-child-div">
            <h2>${gateDateFun(data.data[5].ts)}</h2>
            <i class="${weatherIcons[data.data[5].weather.code]}"></i>
            <p>${data.data[5].weather.description}</p>
            <h2>${data.data[5].temp}&deg;<span>${units[unit][0]}</span></h2>
          </div>
          <div class="future-days-child-div">
            <h2>${gateDateFun(data.data[6].ts)}</h2>
            <i class="${weatherIcons[data.data[6].weather.code]}"></i>
            <p>${data.data[6].weather.description}</p>
            <h2>${data.data[6].temp}&deg;<span>${units[unit][0]}</span></h2>
          </div>
        </div>
      </div>
    </div>`;
  });
  all_saved_location_div.innerHTML = allLocations.join(" ");
  let removeBtn = document.querySelectorAll(".remove-location");

  // Select all elements with the class "remove-location" and store them in the "removeBtn" variable

  for (let btn of removeBtn) {
    btn.addEventListener("click", async (event) => {
      try {
        if (!token) {
          // Check if the "token" variable is falsy (empty or undefined)
          await Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "Please Create a Account or Login to You Account to remove Location",
          });
          // Display a Swal (SweetAlert) dialog with a message
          return (window.location.href = "signIn_signUp.html");
          // Redirect the user to "signIn_signUp.html"
        }

        const location = event.target.dataset.id;
        // Get the value of the "data-id" attribute from the clicked element

        let obj = {
          location,
        };
        // Create an object "obj" with a property "location" set to the value obtained above

        const response = await fetch(`${BaseURL}removeLocation`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(obj),
        });
        // Send a PATCH request to the server to remove the location using the obtained value and the token for authorization

        const data = await response.json();
        // Parse the response data as JSON

        if (response.ok) {
          // Check if the response status is within the successful range (200-299)

          Swal.fire({
            position: "top",
            icon: "success",
            title: "Location Removed",
            showConfirmButton: false,
            timer: 1500,
          });
          // Display a success Swal (SweetAlert) notification

          savedLocationFetchFun();
          // Call a function named "savedLocationFetchFun" (not shown in the code) to update the saved locations
        } else {
          Swal.fire({
            position: "top",
            icon: "error",
            title: data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          // Display an error Swal (SweetAlert) notification with the error message from the response data
        }
      } catch (error) {
        console.log(error);
        // Log any errors that occur during the execution of the code
      }
    });
  }
}
