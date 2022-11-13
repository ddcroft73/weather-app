import {
    getWeatherWithGPS,
    getForecastFromLocation,
} from "./modules/weather-api.js";

import { SearchAndSave } from "./psuedo-components/search-and-save.js"

//import { twoDayForecastTest } from "./modules/two-day-forecast.js";

const locationInput = document.querySelector(".text");
const submit = document.querySelector(".button");

submit.addEventListener("click", () => {//
    getForecastFromLocation(locationInput.value);
});


// load the search save widget type thing
const searchBox = new SearchAndSave();
const locations = searchBox.getSearches();
searchBox.loadMenu(locations);
//import {
//    showUI
//} from "./modules/util.js";

//showUI();
getWeatherWithGPS();

const pulseIcon = document.querySelector(".weather-icon");
pulseIcon.addEventListener('mouseover', () => {
    pulseIcon.classList.add("pulse");
    setTimeout(() => {
        pulseIcon.classList.remove("pulse");
    }, "1000");
});

