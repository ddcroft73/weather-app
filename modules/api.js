
import { findCelsius } from "./util.js";
import { findFahrenheit } from "./util.js";
import { formatTime } from "./util.js";
import { getDayFromTimeStamp } from "./util.js";
import { getIcon } from "./util.js";
import { setBackground } from "./util.js";
import { getDateString } from "./util.js";
import { DOM, API_KEY_30 } from "/main.js";

/*
   1. gets the users coordinates from the browser, 2. uses the cooridinates to call a reverse look up to get the location
   location is then fed to a basic weather PAI to get the cooridnates, again, but also some other info. I dont need the first API
   call to get the cooridnates, unless the user is searching from location only. So I still need to get them. It seems redundant 
   but In order to use the GPS, I had to get the location in order to get the relevant weather info that is not offered with "OneCall"
   
   so if the user is using a location, city and state, i need the cooridinates to call one call and  to get relevant info about the current
   weather. OneCall does not offer info like min temp, max temp, etc. 
*/


// get visitor's location
export const  startProcess = async () => {
  DOM.spinner.style.visibility = "visible";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

const getLocationWithCoords = async (lat, long) => {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&appid=${API_KEY_30}`;
      const resp = await fetch(url, { mode: "cors" });
      const data = await resp.json();
      return data;
    } 
    catch(err) {
        console.error(err);
    }  
};

const showPosition = async (position) => {
  // call the api with async
  try {
      const locationInfo = await getLocationWithCoords(position.coords.latitude, position.coords.longitude); 
      // uses the first location reuturned... need to test this in other locations
      const name = locationInfo[0].name;
      const state = locationInfo[0].state;

      // gets the forcast of the users current location.
      getForecast(`${name}, ${state}`, API_KEY_30, "minutely,hourly,alerts", DOM);
  } 
  catch(err)  {
    console.error(err);
  }  
};

/**
 *    getForecast async function
 *
 * @param {*} location {city, state} 
 * @param {*} key      {The API Key}
 * @param {*} excludes {minutely, hourly, daily, alerts}
 *
 *  Encapsulates two API calls needed to get the weather data neeeded. The first API call takes in the location.
 *  city and state seperated by a comma, zipcode, or a country name. That information is used to make a call
 *  which results in the cooridnates of the location. The cooridinates are then used to make a different API call (A more
 *  robust API) so that I can get the real data.
 *
 *  getWeatherData is the API that gets the coord from the location and in turn calls getForeCastData with said coord
 *  and finally returns the promise I'm after. That promise is then passed into a regular function as an object so that
 *  its prpoperties may be picked at to get the information to populate the UI.
 *
 * Weather data can be gatered for the next 8 days, by the minute of today, hourly for today, and with weather alerts.
 * All this can be dialed in by the user.
 */

export const getForecast = async (location, key, excludes) => {
  // makes the api call to get the weather data alwys in F

  const getForecastData = async (key, coordinates) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=${excludes}&units=imperial&appid=${key}`;
    const resp = await fetch(url, { mode: "cors" });
    const data = await resp.json();
    // adds the name of the locatiion as gathered from getWeatherData to be used in the UI as it is
    // not available in the final call
    data.name = coordinates.name;
    data.country = coordinates.country;
    data.temp_max = coordinates.temp_max;
    data.temp_min = coordinates.temp_min;
    console.log(data.temp_max, data.temp_min);
    return data;
  };
  //https://api.openweathermap.org/data/2.5/weather?q=yo,southcarolina&units=imperial&appid=69eb4c4ba2a0b741f04a495fd8e76b06
  //https://api.openweathermap.org/data/3.0/onecall?lat=34.9496&lon=-81.9321&exclude=minutely,hourly,alerts&units=imperial&appid=69eb4c4ba2a0b741f04a495fd8e76b06

  // makes an API call and gets the coordinates of the location, need the coord to get
  // the weather data I need.
  const getWeatherData = async (key, location) => {
    // get the coordinates of this location
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`;

    try {
        const resp = await fetch(url, { mode: "cors" });
        const data = await resp.json();        
        
        // extract some data needed that is not in the onecall api.
        const additionalData = {
          lon: data.coord.lon,
          lat: data.coord.lat,
          name: data.name,
          country: data.sys.country,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
        };

        DOM.location1.textContent = location;
        // using the coords of location make another API call for forecast data
        const forecastData = await getForecastData(key, additionalData);
        return forecastData;
    }
     catch(err) {
      // first get the error code from the response
      alert(`The location: ${location} could not be found.`
            `${err}`);
     }
  };
  
  try {
      const weatherData = await getWeatherData(key, location);
      // pass the promise into a regular function so it can be picked apart as an object
      parseWeatherData(weatherData);
  } catch(err) {
      console.log(err)
  }  
  DOM.spinner.style.visibility = "hidden";
}

// called from inside async function, promise is passed in and results in an object with the weather data.
const parseWeatherData = (APIData) => {
  // get acces to the array data in the API for each day of the forecast
  // do current conditions
  displayCurrentConditions(APIData);
  // do the 7 day forecast
  displayWeatherForWeek(APIData);
};


const displayCurrentConditions = (APIData) => {
  const { temp_max, temp_min } = APIData;
  const { dt, temp, humidity, sunrise, sunset, feels_like, wind_speed } = APIData.current;
  const { main, description } = APIData.current.weather[0];
  const temperatureString = `${Math.round(temp)}`; //;
  
  setBackground(main, DOM, description, sunset);
  DOM.weatherIcon.src = getIcon(main, DOM);

  DOM.today.textContent = getDateString(dt);
  DOM.currentTemp.innerHTML = temperatureString ;  // replace this with pressure
  DOM.hiTemp.innerHTML = `${Math.round(temp_max)}&#176`;;
  DOM.loTemp.innerHTML = `${Math.round(temp_min)}&#176`;;
  
  DOM.windSpeed.innerHTML ='&nbsp;' + wind_speed + "/m";
  DOM.currentTempTwo.innerHTML = temperatureString;
  DOM.condition.innerHTML = description;
  DOM.humidity.innerHTML = "&nbsp" + humidity + "%";
  DOM.feelsLike.innerHTML = `${Math.round(feels_like)}&#176`;  
  DOM.sunup.innerHTML = formatTime(sunrise);
  DOM.sundown.innerHTML = formatTime(sunset);
  
};

const displayWeatherForWeek = (APIData) => {

    for (let index = 0; index < 7; index++) {
      DOM.day[index].date.innerHTML = getDateString(APIData.daily[index+1].dt);/*DateString(
        getDayFromTimeStamp(APIData.daily[index+1].dt)
      )//.split(" ")
       //.splice(0, 3)
       //.join(" ");     // slice off the year for daily forecast.
      */
      DOM.day[index].temp.innerHTML = `${Math.round(APIData.daily[index].temp.day)} <span class="degrees">&#176;</span>`;
      DOM.day[index].icon.src = getIcon(APIData.daily[index].weather[0].main); //  "SVG/sun.svg"; 
      DOM.day[index].condition.innerHTML = APIData.daily[index].weather[0].description;
      DOM.day[index].tempMax.innerHTML = Math.round(APIData.daily[index].temp.max) + "&#176";
      DOM.day[index].tempMin.innerHTML = Math.round(APIData.daily[index].temp.min) + "&#176";
    }    
}


const handleError = (error) => {
  let errorStr;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorStr = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorStr = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorStr = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      errorStr = "An unknown error occurred.";
      break;
    default:
      errorStr = "An unknown error occurred.";
  }
  console.error("Error occurred: " + errorStr);
};
