import { evalName, capAllWords } from "./util.js";
import { parseWeatherData } from  "./parse-weather-data.js";

const API_KEY_30 = "69eb4c4ba2a0b741f04a495fd8e76b06"; // I only did this because it is a free API key and therefore no need to house on a server, etc.
const excludes = "minutley"; 
const spinner = document.querySelector(".spin");
const curentLocation = document.querySelector(".location");
const locationInput = document.querySelector(".text");

const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
};

const getForecastData = async (coordinates) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=${excludes}&units=imperial&appid=${API_KEY_30}`;
    const resp = await fetch(url, { mode: "cors" });
    const data = await resp.json();
    return data;
};

// USE GPS
export const getWeatherWithGPS = async () => {
    spinner.style.visibility = "visible";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    };
                    
                    const { name, state } = await getLocationFromCoords(coords);
                    const weatherData = await getForecastData(coords);
                    curentLocation.innerHTML = `${name}, ${state}`;
                    locationInput.value = `${name}, ${state}`;                    
                    parseWeatherData(weatherData);                    
                    spinner.style.visibility = "hidden";
                } catch (err) {
                    console.error(err);
                }
            },
            handleError,
            options
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
};

//USE A LOCATION
export const getForecastFromLocation = async (location) => {
    try {
        spinner.style.visibility = "visible";
        
        const coords = await getCoordinatesFromLocation(location);
        const weatherData = await getForecastData(coords);

        curentLocation.innerHTML = capAllWords(location);
        parseWeatherData(weatherData);
        spinner.style.visibility = "hidden";    
       
    } catch (err) {
        // most likely the location is not found...
        spinner.style.visibility = "hidden";
    }
};

const getCoordinatesFromLocation = async (location) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${API_KEY_30}`;
    try {
        const resp = await fetch(url, { mode: "cors" });
        const data = await resp.json();

        const coords = {
            lat: data[0].lat,
            lon: data[0].lon,
        };
        return coords;
    } catch (err) {
        alert(`Location: ${location} can not be found.`);
    }
};

const getLocationFromCoords = async (coords) => {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY_30}`;

    try {
        const resp = await fetch(url, { mode: "cors" });
        const data = await resp.json();

        const location = {
            name: evalName(data[0].name), // often a GPS location is not exact. If not it may return "County" in the name.
            state: data[0].state, // THis is better if not. Makes the name way to long.
        };

        return location;
    } catch (err) {
        console.log(err.message);
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
    alert("Error occurred: " + errorStr);
};