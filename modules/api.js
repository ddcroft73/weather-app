
import { findCelsius } from "./util.js";
import { findFahrenheit } from "./util.js";
import { DateString } from "./util.js";
import { formatTime } from "./util.js";
import { getDayFromTimeStamp } from "./util.js";
import { getIcon } from "./util.js";
import { setBackground } from "./util.js";
import { setMainIcon } from "./util.js";

//34.9496  -81.9321

/**
 *    getForecast async function
 *
 * @param {*} location {city, state} || {zipcode} || {country}
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
 *  phew.... Im gonna post this on r/programmingHorror... its confusing af but it works well.
 *
 * Weather data can be gatered for the next 8 days, by the minute of today, hourly for today, and with weather alerts.
 * All this can be dialed in by the user.
 */

export const getForecast = async (location, key, excludes, dom) => {
    // makes the api call to get the weather data alwys in F
    dom.spinner.style.visibility = 'visible';

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
      console.log(data.temp_max, data.temp_min)
      return data;
    }

    // makes an API call and gets the coordinates of the location, need the coord to get
    // the weather data I need.
    const getWeatherData = async (key, location) => {
      // get the coordinates of this location
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`;
      const resp = await fetch(url, { mode: "cors" });
      const data = await resp.json();

      // extract some data needed that is not in the onecall api.
      const coord = {
        lon: data.coord.lon,
        lat: data.coord.lat,
        name: data.name,
        country: data.sys.country,
        temp_max: data.main.temp_max,
        temp_min: data.main.temp_min
      };
      
      dom.location1.textContent = location;
      
      // using the coords of location make another API call for forecast data
      const forecastData = await getForecastData(key, coord);
      return forecastData;
    }

  const weatherData = await getWeatherData(key, location);
  // pass the promise into a regular function so it can be picked apart as an object
  parseWeatherData(weatherData, dom);
  dom.spinner.style.visibility = 'hidden';
}

// called from inside async function, promise is passed in and results in an object with the weather data.
const parseWeatherData = (APIData, dom) => {
  // get acces to the array data in the API for each day of the forecast
  // do current conditions
  displayCurrentConditions(APIData, dom);
  // do the 7 day forecast
  displayWeatherForWeek(APIData, dom);
};


const displayCurrentConditions = (APIData, dom) => {
  const { dt, temp, humidity, sunrise, sunset, feels_like, wind_speed } = APIData.current;
  const { main, description } = APIData.current.weather[0];
  const todaysDate = DateString();
  const temperatureString = `${Math.round(temp)}`; //;
  console.log(getDayFromTimeStamp(dt))
  // set the page elements according to current conditions
  dom.today.textContent = todaysDate;
  dom.currentTemp.innerHTML = temperatureString ;

  dom.currentTempTwo.innerHTML = temperatureString;
  dom.condition.innerHTML = description;
  dom.humidity.innerHTML = "&nbsp" + humidity + "%";
  dom.feelsLike.innerHTML = `${Math.round(feels_like)}&#176`;  
  dom.sunup.innerHTML = formatTime(sunrise);
  dom.sundown.innerHTML = formatTime(sunset);
  
  setBackground(main, dom);
  dom.weatherIcon.src = getIcon(main, dom);
};

const displayWeatherForWeek = (APIData, dom) => {

    for (let index = 0; index < 7; index++) {
      dom.day[index].date.innerHTML = DateString(
        getDayFromTimeStamp(APIData.daily[index + 1].dt)
      )//.split(" ")
       //.splice(0, 3)
       //.join(" ");     // slice off the year for daily forecast.
      
      dom.day[index].temp.innerHTML = `${Math.round(APIData.daily[index].temp.day)} <span class="degrees">&#176;</span>`;
      dom.day[index].icon.src = getIcon(APIData.daily[index].weather[0].main); //  "SVG/sun.svg"; 
      dom.day[index].condition.innerHTML = APIData.daily[index].weather[0].description;
    }    
}


