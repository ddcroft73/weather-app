import { displayHourlyData } from "./two-day-forecast.js";
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
    getWindDirection,
    showUI
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
    
const pulseIcon = document.querySelector(".weather-icon");

 pulseIcon.classList.add("pulse");
 setTimeout(() => {
     pulseIcon.classList.remove("pulse");
 }, "3000");
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
    let daily = [];

    for (let index = 0; index < 8; index++) {
        daily[index] = {
            date: document.querySelector("#day-date-" + index),
            icon: document.querySelector("#day-icon-" + index),
            temp: document.querySelector("#day-temp-" + index),
            condition: document.querySelector("#day-condition-" + index),
            tempMax: document.querySelector("#hi" + index),
            tempMin: document.querySelector("#lo" + index),
        };
    }
    for (let index = 0; index < 8; index++) {
        const { main, description, icon } = weatherData.daily[index].weather[0];
        daily[index].date.innerHTML = getDateString(weatherData.daily[index].dt);
        daily[index].temp.innerHTML = `${Math.round(
            weatherData.daily[index].temp.day
        )} <span class="degrees">&#176;</span>`;
        daily[index].icon.src = getIcon(false, icon, main, description); //  "SVG/sun.svg";
        daily[index].condition.innerHTML = capAllWords(weatherData.daily[index].weather[0].description);
        daily[index].tempMax.innerHTML = Math.round(weatherData.daily[index].temp.max) + "&#176";
        daily[index].tempMin.innerHTML = Math.round(weatherData.daily[index].temp.min) + "&#176";
    }
};
