import {
    getWeatherWithGPS,
    getForecastFromLocation,
} from "./modules/weather-api.js";

import { SearchAndSave } from "./psuedo-components/search-and-save.js"

//import { twoDayForecastTest } from "./modules/two-day-forecast.js";

// Create a DOM object to create references to the elements on the page.
export let DOM = {};

DOM.spinner = document.querySelector(".spin");
//DOM.clear = document.querySelector(".clear");
DOM.curentLocation = document.querySelector(".location");

// info for today
DOM.weatherIcon = document.querySelector("#weather-icon");
DOM.today = document.querySelector(".today-date-time");
DOM.currentTemp = document.querySelector(".temp-");

DOM.pressure = document.querySelector("#pressure");

DOM.hiTemp = document.querySelector(".hi");
DOM.loTemp = document.querySelector(".lo");
DOM.condition = document.querySelector(".condition-text");
DOM.humidity = document.querySelector("#current-humidity");
DOM.dewPoint = document.querySelector("#dewpoint");
DOM.feelsLike = document.querySelector("#feels-like");
DOM.windSpeed = document.querySelector("#wind-speed");
DOM.windDirection = document.querySelector("#deg");
DOM.sunup = document.querySelector("#sunup");
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
        tempMin: document.querySelector("#lo" + index),
    };
}
// the DOM.daily elements are created dynamically and added later
DOM.threeDaysContainerInner = document.querySelector(
    ".three-days-container-inner"
);

// user input
//DOM.location = document.querySelector("#location");
//DOM.submit = document.querySelector("#submit")

// for color changes due to tofays weather
DOM.dayBackground = document.querySelector(".day");
DOM.backGround = document.querySelector(".main-container");
DOM.conditionBorders = document.getElementById("conditionsBorders").childNodes;
DOM.daysBorders = document.getElementById("daysBorders").childNodes;
DOM.header = document.querySelector(".search");
DOM.body = document.querySelector("body");
DOM.leftInfo = document.querySelector(".inner-left");
DOM.rightInfo = document.querySelector(".inner-right");

DOM.insideDayNodes = document.querySelectorAll(".inside-day-container div");

DOM.locationInput = document.querySelector(".text");

DOM.submit = document.querySelector(".button");

DOM.submit.addEventListener("click", () => {
    getForecastFromLocation(DOM.locationInput.value, DOM);
    console.log(`location == ${DOM.locationInput.value}`);
});


// load the search save widget type thing
const searchBox = new SearchAndSave();
const locations = searchBox.getSearches();
searchBox.loadMenu(locations);

getWeatherWithGPS(DOM);



