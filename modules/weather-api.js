import {
    findCelsius,
    findFahrenheit,
    formatTime,
    getIcon,
    setBackground,
    getDateString,
    isNight,
    evalName,
    capAllWords,
    getWindDirection
} from "./util.js";

import { displayHourlyData } from "./two-day-forecast.js";

//import { twoDayForecastTest } from "./two-day-forecast.js";

const API_KEY_30 = "69eb4c4ba2a0b741f04a495fd8e76b06"; // I only did this because it is a free API key and therefore no need to house on a server, etc.
const excludes = "minutley"; // 1000 calls per-day

const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
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

const getForecastData = async (coordinates) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=${excludes}&units=imperial&appid=${API_KEY_30}`;
    const resp = await fetch(url, { mode: "cors" });
    const data = await resp.json();
    return data;
};

// USE GPS
export const getWeatherWithGPS = async (dom) => {
    dom.spinner.style.visibility = "visible";
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
                    dom.spinner.style.visibility = "hidden";
                    dom.curentLocation.innerHTML = `${name}, ${state}`;

                    dom.locationInput.value = `${name}, ${state}`;
                    
                    parseWeatherData(weatherData, dom);
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
export const getForecastFromLocation = async (location, dom) => {
    try {
        dom.spinner.style.visibility = "visible";
        
        const coords = await getCoordinatesFromLocation(location);
        const weatherData = await getForecastData(coords);

        dom.curentLocation.innerHTML = capAllWords(location);
        parseWeatherData(weatherData, dom);
        dom.spinner.style.visibility = "hidden";    
       
    } catch (err) {
        // most likely the location is not found...
        dom.spinner.style.visibility = "hidden";
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

const parseWeatherData = (weatherData, dom) => {
    displayCurrentConditions(weatherData, dom);
    displayWeatherForWeek(weatherData, dom);
    //twoDayForecastTest(twoDayForecastTest, dom);
    displayHourlyData(weatherData, dom);
};

const displayCurrentConditions = (weatherData, dom) => {
    const { timezone_offset } = weatherData;
    const {
        dt,
        temp,
        humidity,
        sunrise,
        sunset,
        feels_like,
        wind_speed,
        pressure,
        wind_deg,
        dew_point
    } = weatherData.current;
    const { max, min } = weatherData.daily[0].temp;
    const { main, description, icon } = weatherData.current.weather[0];
    const current = new Date();
    const time = current.toLocaleTimeString("en-US");
    const night = isNight(sunset, timezone_offset);

    setBackground(main, description, dom, night);
    dom.weatherIcon.src = getIcon(night, icon, main, description);


    dom.today.textContent = getDateString(dt) + " -> " + time;
    dom.currentTemp.innerHTML = `${Math.round(temp)}`; // replace this with pressure
    dom.hiTemp.innerHTML = `${Math.round(max)}&#176`;
    dom.loTemp.innerHTML = `${Math.round(min)}&#176`;
    dom.windSpeed.innerHTML =
        "&nbsp;" +
        Math.round(wind_speed) +
        "/mph" ;
    dom.windDirection.src = getWindDirection(wind_deg);    
    dom.pressure.innerHTML = pressure;
    dom.condition.innerHTML = capAllWords(description);
    dom.humidity.innerHTML = "&nbsp" + humidity + "%";
    dom.feelsLike.innerHTML = `${Math.round(feels_like)}&#176`;
    dom.dewPoint.innerHTML = `&nbsp;${Math.round(dew_point)}&#176`;
    dom.sunup.innerHTML = formatTime(sunrise);
    dom.sundown.innerHTML = formatTime(sunset);
};

const displayWeatherForWeek = (weatherData, dom) => {
    for (let index = 0; index < 8; index++) {
        const { main, description, icon } = weatherData.daily[index].weather[0];

        dom.daily[index].date.innerHTML = getDateString(
            weatherData.daily[index].dt
        );
        dom.daily[index].temp.innerHTML = `${Math.round(
            weatherData.daily[index].temp.day
        )} <span class="degrees">&#176;</span>`;
        dom.daily[index].icon.src = getIcon(false, icon, main, description); //  "SVG/sun.svg";
        dom.daily[index].condition.innerHTML = capAllWords(
            weatherData.daily[index].weather[0].description
        );
        dom.daily[index].tempMax.innerHTML =
            Math.round(weatherData.daily[index].temp.max) + "&#176";
        dom.daily[index].tempMin.innerHTML =
            Math.round(weatherData.daily[index].temp.min) + "&#176";
    }
};
