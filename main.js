import {
  getWeatherWithGPS,
  getForecastFromLocation,
} from "./modules/weather-api.js";

//import { twoDayForecastTest } from "./modules/two-day-forecast.js";


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
DOM.daily = [];

for (let index = 0; index < 8; index++) {
  DOM.daily[index] = {
    date: document.querySelector("#day-date-" + index),
    icon: document.querySelector("#day-icon-" + index),
    temp: document.querySelector("#day-temp-" + index),
    condition: document.querySelector("#day-condition-" + index),
    tempMax: document.querySelector("#hi" + index),
    tempMin: document.querySelector("#lo" + index)
  };
}
// the DOM.daily elements are created dynamically and added later
DOM.threeDaysContainerInner = document.querySelector(".three-days-container-inner");

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
DOM.leftInfo = document.querySelector(".inner-left");
DOM.rightInfo = document.querySelector(".inner-right");
DOM.title = document.querySelector(".title").childNodes;


DOM.submit.addEventListener('click', () => {
  const location = DOM.location.value;
  
  if (location != "") {
    getForecastFromLocation(location, DOM);
  } else {
    alert("You must enter a location.")
  }
});

DOM.clear.addEventListener("click", () => {
  DOM.location.value = "";
});

/*
window.addEventListener("beforeunload",  (e) => {
  e.preventDefault();
  e.returnValue = "";
  console.log(DOM.location.value);
});
*/

// decide if the user is trying to get the gps location eather, or if they are trying to refresh and get the weather of the current location
const currLocation = DOM.location.value;

if (currLocation == "") {
  // gettting GPS
  getWeatherWithGPS(DOM);
  //twoDayForecastTest(DOM);
} else {
  // save the last location entered in the search box, and load it?
  // getting the weather at current location
  // Chrome deltes the values in the text box, FireFox, does not... wtf?
 // getForecastFromLocation(currLocation, DOM);
}


