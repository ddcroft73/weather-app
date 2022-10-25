import { getDateString } from "./util.js";

/**
 * this module will handle all the actions needed to create and populate the 48 hour forecast.
 */


// START TESTING CODE
// importing in test data so i dont have to acceess the API everytime
//import { testJsonData } from "./json-test-data.js";
export const twoDayForecastTest = (dom) => {
  // create the routines exactly as they are called with the real Data
  displayHourlyData(testJsonData, dom);
};
// END TEST CODE FOR FOrecast


// the parent container
const threeDayContainer = document.querySelector(".three-days-container-inner");

// function takes the array set up by getHourlyData and calls other functions to dynamically create the
// elements according to the data, and display the information.
export const displayHourlyData = (weatherData) => {
  const hourlyData = getHourlyData(weatherData);
  const numDays = hourlyData.length;

  //console.log(hourlyData);
  // systematicallu create the elemetns by the day using the info in hourlyData
  for (let day = 0; day < numDays; day++) {
    displayHourlyForecastByDay(hourlyData[day], day);
    // add divider and style
    addDivider((day+1));
  }
};

const addDivider = (cnt) => {
    // divider should match the hifght of the day to the left
    addElement("div", threeDayContainer, {className: 'divider'+cnt});
};


// creates the elements needed to make up one day as forecasted by each hour up to 48 hours
const displayHourlyForecastByDay = (data, day) => {
  // create the parent container
  const fortyEightContainer = addElement("div", threeDayContainer, {
    className: "forty-8-days",
  });
  // create the Date, Icon Nad Hi\Lo icons.
  addElement("div", fortyEightContainer, {
    className: "date-day",
    idName: "date-day-" + day,
    content: data[day].date,
  });
  const mainIcon = addElement("div", fortyEightContainer, {
    className: "main-icon",
  });
  addElement("img", mainIcon, {
    src: `./SVG/${data[day].icon}.svg`,
    width: "65",
  });
  addElement("div", fortyEightContainer, {
    className: "day-hi-lo",
    idName: "day-hi-lo-" + day,
    content: "Hi/LO", // Code in the days hi and lo
  });
  
  // add the forecast for each hour of the day.
  for (let hour in data) {
    // create the hour div
    const hourContainer = addElement("div", fortyEightContainer, {
      className: "hour",
    });

    addElement("div", hourContainer, {
      className: "hour-cell-time",
      idName: "hour-time-" + hour,
      content: data[hour].time,
    });

    const iconContainer = addElement("div", hourContainer, {
      className: "hour-cell-icon",
    });
    addElement("img", iconContainer, {
      idName: "hour-icon-" + hour,
      src: `./SVG/${data[hour].icon}.svg`,
      width: "18",
    });

    addElement("div", hourContainer, {
      className: "hour-cell-temp",
      idName: "hour-temp-" + hour,
      content: Math.round(data[hour].temp) + "&#176;",
    });
  }
};


// returns the hour of the day
const getHours = (unixTimeStamp) => {
  let date = new Date(unixTimeStamp * 1000);
  let hours = date.getHours();
  if (hours === 0) {
    hours = 0;
  }
  return hours;
};

// creates a 2d array with all the data needed to forecast for the next 48hours
const getHourlyData = (weatherData) => {
  const { hourly } = weatherData;

  let day = 0;
  let totalHour = 0;
  let hourOnThisDay = 0;
  let hourlyDataByDay = [];

  // init 2D Array;
  for (let cnt = 0; cnt < 3; cnt++) {
    hourlyDataByDay[cnt] = [];
  }

  // populate the array with the weather data for each day to be used in the
  // 48 hour forecast.
  while (totalHour < 47) {
    hourlyDataByDay[day][hourOnThisDay] = {
      temp: hourly[totalHour].temp,
      icon: hourly[totalHour].weather[0].icon,
      time: `${padWithZeros(getHours(hourly[totalHour].dt))}`,
      date: getDateString(hourly[totalHour].dt),
    };

    hourOnThisDay++;
    totalHour++;

    if (getHours(hourly[totalHour].dt) === 0) {
      hourOnThisDay = 0; // start hours over for the next day
      day++; // go to next day
    }
  }
  return hourlyDataByDay;
};

// if its a single digit hour pad with a zero and append :00 to all
const padWithZeros = (time) => {
    if (time.toString().length == 1) {
        time = "0" + time;
    }
    return time + ':00';
};

// adds a new element to the page with any attributes and\or content
const addElement = (
  tag,
  parent,
  {
    className = null,
    idName = null,
    src = null,
    width = null,
    content = null,
  } = {}
) => {
  const div = document.createElement(tag);
  if (idName != null) {
    div.id = idName;
  }
  if (className != null) {
    div.className = className;
  }
  if (src != null) {
    div.src = src;
  }
  if (width != null) {
    div.width = width;
  }
  if (content != null) {
    div.innerHTML = content;
  }
  parent.appendChild(div);

  return div;
};

