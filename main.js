
//import { getForecast, startProcess } from "./modules/api.js";
import { getForecast } from "./modules/weather-api.js";
import { handleError } from "./modules/util.js";


//import { getLocationWithCoords } from "./modules/api.js"
const API_KEY_30 = "69eb4c4ba2a0b741f04a495fd8e76b06"; // for 3.0 '69eb4c4ba2a0b741f04a495fd8e76b06'; // 2.5 20f7632ffc2c022654e4093c6947b4f4

const options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
};

// Create a DOM object to create references to the elements on the page.
let DOM = {};

DOM.spinner = document.querySelector('.spin');
DOM.clear = document.querySelector(".clear");
DOM.location1 = document.querySelector('.location');

// info for today
DOM.weatherIcon = document.querySelector("#weather-icon");
DOM.today = document.querySelector(".today-date-time");
DOM.currentTemp = document.querySelector(".temp-");

DOM.pressure = document.querySelector("#pressure");

DOM.hiTemp = document.querySelector(".hi");
DOM.loTemp = document.querySelector(".lo");
DOM.condition = document.querySelector(".condition-text");
DOM.humidity = document.querySelector("#current-humidity");
DOM.feelsLike = document.querySelector("#feels-like");
DOM.windSpeed = document.querySelector("#wind-speed");
DOM.sunup = document.querySelector('#sunup');
DOM.sundown = document.querySelector("#sundown");

// info for the next 7 days
DOM.day = [];

for (let index = 0; index < 8; index++) {
  DOM.day[index] = {
    date: document.querySelector("#day-date-" + index),
    icon: document.querySelector("#day-icon-" + index),
    temp: document.querySelector("#day-temp-" + index),
    condition: document.querySelector("#day-condition-" + index),
    tempMax: document.querySelector("#hi" + index),
    tempMin: document.querySelector("#lo" + index)
  };
}


// user input
DOM.location = document.querySelector("#location");
DOM.submit = document.querySelector("#submit")

// for color changes due to tofays weather
DOM.dayBackground = document.querySelector(".day");
DOM.backGround = document.querySelector(".main-container");
DOM.conditionBorders = document.getElementById("conditionsBorders").childNodes;
DOM.daysBorders = document.getElementById("daysBorders").childNodes;
DOM.header =  document.querySelector('.search');
DOM.body = document.querySelector('body');

DOM.submit.addEventListener('click', () => {
  // get the forecast for this location
  console.log(DOM.location.value)
  const location = DOM.location.value;
  if (location != "") {
    // what to do if the location soes not exist
    getForecast(location, API_KEY_30, "minutely,hourly,alerts", DOM);
  } else {
    alert("You must enter a location.")
  }
});

DOM.clear.addEventListener("click", () => {
  DOM.location.value = "";
});


export const getGPSLocation = async () => {
  DOM.spinner.style.visibility = "visible";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      translateCoordinates,
      handleError,
      options
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

// uses the users position to get there location, (city, state) and then calls the weather APIS
const translateCoordinates = async (position) => {
  try {
    const locationInfo = await getLocationWithCoords(
      position.coords.latitude,
      position.coords.longitude
    );
    // uses the first location returned... need to test this in other locations
    const name = locationInfo[0].name;
    const state = locationInfo[0].state;

    // gets the forcast of the users current location.
    getForecast(`${name}, ${state}`, API_KEY_30, "minutely,hourly,alerts", DOM);
  } catch (err) {
    console.error(err);
  }
};

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


/*
   1. gets the users coordinates from the browser. 
   2. uses the cooridinates to call a reverse look up to get the location
   location is then fed to a basic weather PAI to get the cooridnates, again, but also some other info. I dont need the first API
   call to get the cooridnates, unless the user is searching from location only. So I still need to get them. It seems redundant 
   but In order to use the GPS, I had to get the location in order to get the relevant weather info that is not offered with "OneCall"
   
   so if the user is using a location, city and state, i need the cooridinates to call one call and  to get relevant info about the current
   weather. OneCall does not offer info like min temp, max temp, etc. 

   This was a lot cleaner... I could not import from this file because it was a text file.. so to speak. so I had to define certain functions
   here to be able to use DOM. Weird.. it would work with all the API functions in api.js on my local machine, but barked errors when live.
   so... some API code is here until i can figure out a cleaner way. Likely I need to rethink it. I didnt designe at fisrst to use GPS and there was where
   it got a bit weird.
*/

// decide if the user is trying to get the gps location eather, or if they are trying to refresh and get the weather of the current location

if (DOM.location.value == "") {
  // gettting GPS
  getGPSLocation();
} else {
  // getting the weather at current location
  // feed the location into function to get the cooridinates of this location
  console.log('Getting Weather for current location')
  
}
