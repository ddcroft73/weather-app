
import { getForecast } from "./modules/api.js";

const API_KEY_30 = "69eb4c4ba2a0b741f04a495fd8e76b06"; // for 3.0 '69eb4c4ba2a0b741f04a495fd8e76b06'; // 2.5 20f7632ffc2c022654e4093c6947b4f4
const defLocation = 'Spartanburg, South Carolina';

// Create a DOM object to create references to the elements on the page.
export let DOM = {};

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
DOM.backGround = document.querySelector(".main-container");
DOM.conditionBorders = document.getElementById("conditionsBorders").childNodes;
DOM.daysBorders = document.getElementById("daysBorders").childNodes;


DOM.submit.addEventListener('click', () => {
  // get the forecast for this location
  console.log(DOM.location.value)
  const location = DOM.location.value;
  // what to do if the location soes not exist
  getForecast(location, API_KEY_30, "minutely,hourly,alerts", DOM);
});

DOM.clear.addEventListener("click", () => console.log('DOM.location.value'));


// When the app loads. check local storage to see if ther is a location, if so use it to load the initial
// forecast. If Not, load th defLocation.

// start the initial forecast with just today and the upcoming week.
getForecast(defLocation, API_KEY_30, 'minutely,hourly,alerts', DOM);
