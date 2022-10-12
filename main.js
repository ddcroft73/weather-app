
//import { getForecast, startProcess } from "./modules/api.js";
import { getForecast } from "./modules/api.js";

const API_KEY_30 = "69eb4c4ba2a0b741f04a495fd8e76b06"; // for 3.0 '69eb4c4ba2a0b741f04a495fd8e76b06'; // 2.5 20f7632ffc2c022654e4093c6947b4f4
const defLocation = 'Spartanburg, South Carolina';

// Create a DOM object to create references to the elements on the page.
let DOM = {};

DOM.spinner = document.querySelector('.spin');
DOM.clear = document.querySelector(".clear");
DOM.location1 = document.querySelector('.location');

// info for today
DOM.weatherIcon = document.querySelector("#weather-icon");
DOM.today = document.querySelector(".today-date-time");
DOM.currentTemp = document.querySelector(".temp-");

DOM.currentTempTwo = document.querySelector("#current-temp");

DOM.hiTemp = document.querySelector(".hi");
DOM.loTemp = document.querySelector(".lo");
DOM.condition = document.querySelector(".condition-text");
DOM.humidity = document.querySelector("#current-humidity");
DOM.feelsLike = document.querySelector("#feels-like");
DOM.windSpeed = document.querySelector("#wind-speed");
DOM.sunup = document.querySelector('#sunup');
DOM.sundown = document.querySelector("#sundown");

// info for the next 7 days
DOM.day = [
  {
    date: document.querySelector("#day-date-1"),
    icon: document.querySelector("#day-icon-1"),
    temp: document.querySelector("#day-temp-1"),
    condition: document.querySelector("#day-condition-1"),
    tempMax: document.querySelector("#hi1"),
    tempMin: document.querySelector("#lo1"),
  },
  {
    date: document.querySelector("#day-date-2"),
    icon: document.querySelector("#day-icon-2"),
    temp: document.querySelector("#day-temp-2"),
    condition: document.querySelector("#day-condition-2"),
    tempMax: document.querySelector("#hi2"),
    tempMin: document.querySelector("#lo2"),
  },
  {
    date: document.querySelector("#day-date-3"),
    icon: document.querySelector("#day-icon-3"),
    temp: document.querySelector("#day-temp-3"),
    condition: document.querySelector("#day-condition-3"),
    tempMax: document.querySelector("#hi3"),
    tempMin: document.querySelector("#lo3"),
  },
  {
    date: document.querySelector("#day-date-4"),
    icon: document.querySelector("#day-icon-4"),
    temp: document.querySelector("#day-temp-4"),
    condition: document.querySelector("#day-condition-4"),
    tempMax: document.querySelector("#hi4"),
    tempMin: document.querySelector("#lo4"),
  },
  {
    date: document.querySelector("#day-date-5"),
    icon: document.querySelector("#day-icon-5"),
    temp: document.querySelector("#day-temp-5"),
    condition: document.querySelector("#day-condition-5"),
    tempMax: document.querySelector("#hi5"),
    tempMin: document.querySelector("#lo5"),
  },
  {
    date: document.querySelector("#day-date-6"),
    icon: document.querySelector("#day-icon-6"),
    temp: document.querySelector("#day-temp-6"),
    condition: document.querySelector("#day-condition-6"),
    tempMax: document.querySelector("#hi6"),
    tempMin: document.querySelector("#lo6"),
  },
  {
    date: document.querySelector("#day-date-7"),
    icon: document.querySelector("#day-icon-7"),
    temp: document.querySelector("#day-temp-7"),
    condition: document.querySelector("#day-condition-7"),
    tempMax: document.querySelector("#hi7"),
    tempMin: document.querySelector("#lo7"),
  },
];

// user input
DOM.location = document.querySelector("#location");
DOM.submit = document.querySelector("#submit")

// for color changes due to tofays weather
DOM.dayBackground = document.querySelector(".day");
DOM.backGround = document.querySelector(".main-container");
DOM.conditionBorders = document.getElementById("conditionsBorders").childNodes;
DOM.daysBorders = document.getElementById("daysBorders").childNodes;
DOM.header =  document.querySelector('.search');

DOM.submit.addEventListener('click', () => {
  // get the forecast for this location
  console.log(DOM.location.value)
  const location = DOM.location.value;
  // what to do if the location soes not exist
  getForecast(location, API_KEY_30, "minutely,hourly,alerts", DOM);
});

DOM.clear.addEventListener("click", () => {
  DOM.location.value = "";
});



// get visitor's location
const  startProcess = async () => {
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
// starts the api calls.
// gets the users loaction coordinates of their current location. 
// uses this info to make a reverse Geo lookup to get the location so I can use it to make the weather api calls.

startProcess();
//getForecast(defLocation, API_KEY_30, "minutely,hourly,alerts", DOM);
