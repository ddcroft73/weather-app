import { displayHourlyData } from "./two-day-forecast.js";
import {
    findCelsius,
    findFahrenheit,
    formatTime,
    getIcon,
    setBackground,
    getDateString,
    isNight,
    capAllWords,
    getWindDirection,
    showUI,
    pulseIcon
} from "./util.js";

const weatherIcon = document.querySelector("#weather-icon");
const today = document.querySelector(".today-date-time");
const currentTemp = document.querySelector(".temp-");

const DOMpressure = document.querySelector("#pressure");

const hiTemp = document.querySelector(".hi");
const loTemp = document.querySelector(".lo");
const condition = document.querySelector(".condition-text");
const DOMhumidity = document.querySelector("#current-humidity");
const dewPoint = document.querySelector("#dewpoint");
const feelsLike = document.querySelector("#feels-like");
const windSpeed = document.querySelector("#wind-speed");
const windDirection = document.querySelector("#deg");
const sunup = document.querySelector("#sunup");
const sundown = document.querySelector("#sundown");

export const parseWeatherData = (weatherData) => {    
    showUI();
    displayCurrentConditions(weatherData);
    displayWeatherForWeek(weatherData);
    //twoDayForecastTest(twoDayForecastTest, dom);
    displayHourlyData(weatherData);
    pulseIcon();    
};

const displayCurrentConditions = (weatherData) => {
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
        dew_point,
    } = weatherData.current;
    const { max, min } = weatherData.daily[0].temp;
    const { main, description, icon } = weatherData.current.weather[0];
    const current = new Date();
    const time = current.toLocaleTimeString("en-US");
    const night = isNight(sunset, timezone_offset);

    setBackground(main, description, night);
    weatherIcon.src = getIcon(night, icon, main, description);

    today.textContent = getDateString(dt) + " -> " + time;
    currentTemp.innerHTML = `${Math.round(temp)}`; // replace this with pressure
    hiTemp.innerHTML = `${Math.round(max)}&#176`;
    loTemp.innerHTML = `${Math.round(min)}&#176`;
    windSpeed.innerHTML = "&nbsp;" + Math.round(wind_speed) + "/mph";
    
    windDirection.src = getWindDirection(wind_deg);
    DOMpressure.innerHTML = pressure;
    condition.innerHTML = capAllWords(description);
    DOMhumidity.innerHTML = "&nbsp" + humidity + "%";
    feelsLike.innerHTML = `${Math.round(feels_like)}&#176`;
    dewPoint.innerHTML = `&nbsp;${Math.round(dew_point)}&#176`;
    sunup.innerHTML = formatTime(sunrise);
    sundown.innerHTML = formatTime(sunset);
};

const displayWeatherForWeek = (weatherData) => {
    // loop through the API response Data daily Array, and get the info for each day.
    for (let index = 0; index < 8; index++) {
        const { 
            main, 
            description, 
            icon 
        } = weatherData.daily[index].weather[0];

        const date = document.querySelector("#day-date-" + index);
        date.innerHTML = getDateString(weatherData.daily[index].dt);

        const temp = document.querySelector("#day-temp-" + index);
        temp.innerHTML = `${Math.round(weatherData.daily[index].temp.day)} <span class="degrees">&#176;</span>`;

        const weatherIcon = document.querySelector("#day-icon-" + index);
        weatherIcon.src = getIcon(false,icon,main,description); //  "SVG/sun.svg";

        const condition = document.querySelector("#day-condition-" + index);
        condition.innerHTML = capAllWords(weatherData.daily[index].weather[0].description);

        const hiTemp = document.querySelector("#hi" + index);
        hiTemp.innerHTML = Math.round(weatherData.daily[index].temp.max) + "&#176";

        const loTemp = document.querySelector("#lo" + index);
        loTemp.innerHTML = Math.round(weatherData.daily[index].temp.min) + "&#176";
    }
};

