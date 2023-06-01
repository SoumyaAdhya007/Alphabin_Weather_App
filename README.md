# Alphabin_Weather_App

This project is a Weather application that provides various API endpoints for access the weather data from location.

Go and Check it Out [Deployed-link](https://alphabin-weather-app.netlify.app/).

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/SoumyaAdhya007/Alphabin_Weather_App.git`
2. Navigate to the project directory: `cd <project-directory>`
3. Install dependencies: `npm install`
4. Start the server: `npm run server`
5. The application will be accessible at `http://localhost:4040`

## Environment Variables

Take 3 environment variables

1.  API_KEY (get the key from weatherbit.io)
2.  PORT
3.  mongo_url (Mongo db Url)
4.  soltRounds (Bcrypt encryption)
5.  key (jwt token key)

## API Endpoints

| Endpoint                                                    | Method | Description                               | Additional Information                                                   |
| ----------------------------------------------------------- | ------ | ----------------------------------------- | ------------------------------------------------------------------------ |
| `/api/weather?city={cityname}&lang={language}&units={unit}` | GET    | Get current 16 days weather of the city   |                                                                          |
| `/api/register`                                             | POST   | User Can register Their Account           | Body: `{email, password}`                                                |
| `/api/login`                                                | POST   | User can Login their account       | Body: `{email, password}`                                                |
| `/api/userdetails`                                          | POST   | User can Get their details                  | Headers: `{Authorization}`                                               |
| `/api/addPreference`                                        | POST   | User can save their Preference preference | Headers: `{Authorization}`, Body: `{unitPreference, languagePreference}` |
| `/api/addLocation`                                          | POST   | User can add cities                       | Headers: `{Authorization}`, Body: `{location}`                           |
| `/api/removeLocation`                                       | PATCH  | User can remove cities                    | Headers: `{Authorization}`, Body: `{location}`                           |
