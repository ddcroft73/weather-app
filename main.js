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

dayjs().format();
// load the search save component
const searchBox = new SearchAndSave();
const locations = searchBox.getSearches();
searchBox.loadMenu(locations);
// start er up...
getWeatherWithGPS();
