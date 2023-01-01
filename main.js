import {
    getWeatherWithGPS,
    getForecastFromLocation,
} from "./modules/weather-api.js";

import { SearchAndSave } from "./modules/search-and-save.js";
import { generateArrayOfDOMTempElements, toggleTempScale} from "./modules/util.js";
import { hourlyDataCopy } from "./modules/two-day-forecast.js"

//import { twoDayForecastTest } from "./modules/two-day-forecast.js";
const locationInput = document.querySelector("#text");
const submit = document.querySelector("#submit");
submit.addEventListener("click", () => {
    getForecastFromLocation(locationInput.value);
});

// user clicked THe temp scale element...
const tempScale = document.querySelector("#temp-type");
tempScale.addEventListener("click", () => {
    // generate an array and reference all the elements that display temperatures.
    const DOMTempsElements = generateArrayOfDOMTempElements(hourlyDataCopy);  
    toggleTempScale(tempScale, DOMTempsElements);
    
});

const startApp = () => {    
    // init dayjs
    dayjs().format();
    const searchBox = new SearchAndSave();
    const locations = searchBox.getSearches();
    searchBox.loadMenu(locations);
    getWeatherWithGPS();            
}; 

startApp();

