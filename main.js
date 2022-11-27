import {
    getWeatherWithGPS,
    getForecastFromLocation,
} from "./modules/weather-api.js";

import { SearchAndSave } from "./modules/search-and-save.js"

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

import {showUI} from "./modules/util.js"
showUI();
//getWeatherWithGPS();

    /*
const day0 = document.querySelector("#day-0");
day0.addEventListener("mouseover", () => {
    day0.classList.add("pulse");
    setTimeout(() => {
        day0.classList.remove("pulse");
    }, "1000");
});
*/
