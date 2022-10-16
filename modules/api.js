
import { findCelsius } from "./util.js";
import { findFahrenheit } from "./util.js";
import { formatTime } from "./util.js";
import { getDayFromTimeStamp } from "./util.js";
import { getIcon } from "./util.js";
import { setBackground } from "./util.js";
import { getDateString } from "./util.js";
import { isNight } from "./util.js";


const getLocationWithCoords = async (lat, long) => {
  try {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&appid=${API_KEY_30}`;
    const resp = await fetch(url, { mode: "cors" });
    const data = await resp.json();
    return data;
  } catch (err) {
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

// FIX THE API CALL WHERE IT GETS THE TEMP MAX AND MIN
export const getForecast = async (location, key, excludes, DOM) => {
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
      const getWeatherData = async (key, location, DOM) => {
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
        catch(err){
          // first get the error code from the response
          alert(`The location: "${location}" could not be found.`);
        }
      };     

  try {
      const weatherData = await getWeatherData(key, location, DOM);  // getLocationWithCoordinates()
      // pass the promise into a regular function so it can be picked apart as an object
      parseWeatherData(weatherData, DOM);
  } catch(err) {
      console.log(err)
  }  
  DOM.spinner.style.visibility = "hidden";
};

// called from inside async function, promise is passed in and results in an object with the weather data.
const parseWeatherData = (APIData, DOM) => {
  // get acces to the array data in the API for each day of the forecast
  // do current conditions
  displayCurrentConditions(APIData, DOM);
  // do the 7 day forecast
  displayWeatherForWeek(APIData, DOM);
};


const displayCurrentConditions = (APIData, DOM) => {
  //const { temp_max, temp_min } = APIData;
  const { dt, temp, humidity, sunrise, sunset, feels_like, wind_speed } = APIData.current;
  const { max, min } = APIData.daily[0].temp;
  const { main, description } = APIData.current.weather[0];
  const temperatureString = `${Math.round(temp)}`; //;

  const night = isNight(sunset);
  
  setBackground(main, description, DOM, night);
  DOM.weatherIcon.src = getIcon(main, DOM, night);

  DOM.today.textContent = getDateString(dt);
  DOM.currentTemp.innerHTML = temperatureString ;  // replace this with pressure
  DOM.hiTemp.innerHTML = `${Math.round(max)}&#176`;;
  DOM.loTemp.innerHTML = `${Math.round(min)}&#176`;;
  
  DOM.windSpeed.innerHTML ='&nbsp;' + wind_speed + "/m";
  DOM.currentTempTwo.innerHTML = temperatureString;
  DOM.condition.innerHTML = description;
  DOM.humidity.innerHTML = "&nbsp" + humidity + "%";
  DOM.feelsLike.innerHTML = `${Math.round(feels_like)}&#176`;  
  DOM.sunup.innerHTML = formatTime(sunrise);
  DOM.sundown.innerHTML = formatTime(sunset);  
};

const displayWeatherForWeek = (APIData, DOM) => {

    for (let index = 0; index < 8; index++) {
      DOM.day[index].date.innerHTML = getDateString(APIData.daily[index].dt);/*DateString(
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
      console.log(index)
    }    
};
