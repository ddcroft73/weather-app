import { getDateString } from "./util.js";
const mainContainerMobile = document.querySelector(".three-days-container-inner");
const mainContainerDesk = document.querySelector(".forty-8-days-desktop");


export const displayHourlyData = (weatherData) => {
    const MOBILE = 1;
    const DESK = 2;

    const addDivider = (screen, cnt) => {
        if (screen === MOBILE) {
            addElement("div", mainContainerMobile, {
                className: "divider" + cnt,
            });
        } else if (screen === DESK) {
            addElement("div", mainContainerDesk, {
                className: "desk-divider",
            });
        }
    };   
    
    const cleanUp = () => {
        try {
            // dividers
            for (let i = 0; i < 2; i++) {
                let divider = document.querySelector(".divider" + (i + 1));
                divider.remove();
            }
            // the data containers, mobile and desk
            for (let i = 0; i < 3; i++) {
                let innerContainersMobile = document.querySelector(".forty-8-days");
                let innerContainersDeskTop = document.querySelector(".expander");
                innerContainersDeskTop.remove();
                innerContainersMobile.remove();
            }

        } catch (err) {
            console.log("it's nothing");
        }
    };

    // Start logic
    let hourlyData = getHourlyData(weatherData);
    const numDays = hourlyData.length - 1; // the last array is the daily his\los
    document.querySelector(".title").innerHTML = "Forty-Eight Hour Forecast";
    
    cleanUp();
    // Generate the UI
    for (let day = 0; day < numDays; day++) {
        // the object witht he hiLo daily Data
        const [ hiLo ] = hourlyData[hourlyData.length - 1][day];
        //MOBILE
        displayHourlyForecastByDay_MobileUI(hourlyData[day], day, hiLo); //
        addDivider(MOBILE, day + 1); // code this so that it stays one div longer than the height of the day to the left.
        // DESKTOP/TABLET
        displayHourlyForecastByDay_DeskUI(hourlyData[day], day, hiLo);
       // addDivider(DESK, day + 1);
    }
    
    
};

// creates the elements needed to make up one day as forecasted by each hour up to 48 hours
// for Desk\Tablet
// These were done a much more readable way by creating the elements using text and innerHTML. THere is no user
// defined input herer so it should be ok. 
//Truth be told it was a pain in the asss because I took a few weeks off and forgot JS.
const displayHourlyForecastByDay_DeskUI = (data, day, hiLo) => {
    const container = document.querySelector(".forty-8-days-desktop");
    const expander = addElement("div", container, { className: "expander" });

    expander.innerHTML = `
       <div class="day-info">
           <div class="left"> 
               <div id="date-day-${day}" class="date-day-desk">
                    ${data[day].date}
                </div>
                <div id="icon-day-${day}" class="main-icon-desk">
                    <img src="${`./SVG/${data[day].icon}.svg`}" width="65">
                </div>
                <div id="hi-lo-day-${day}" class="day-hi-lo-desk">
                    <span class="hi">${`${hiLo.max}&#176`}</span>/<span class="lo">${`${hiLo.min}&#176`}</span>
                </div>
           </div>
           <div class="right">  
              <div class="hours-container-desk-inner" id="hours-container-day-${day}">
                
              </div>
           </div>
        </div>
    </div>`;
    
    // do the hours fo this day
    const hoursContainer = document.querySelector(
        "#hours-container-day-" + day
    );
    
    for (let hour in data) {
        const thisHour = addElement("div", hoursContainer, {
            className: "hour-desk",
        });

        thisHour.innerHTML = `
            <div id="day-${day}-hour-${hour}" class="hour-cell-time-desk">
                ${data[hour].time}
            </div>
            <div class="hour-cell-icon-desk">
                <img id="day-${day}-hour-${hour}-icon" src="${`./SVG/${data[hour].icon}.svg`}" width="38" />
            </div>
            <div id="day-${day}-hour-${hour}-temp" class="hour-cell-temp-desk">
                ${Math.round(data[hour].temp) + "&#176;"}
            </div>`;
    }
};

// creates the elements needed to make up one day as forecasted by each hour up to 48 hours
// for mobile
//for mobile I created each individual label using JS. Then I learned it's a terrible way to do this.
const displayHourlyForecastByDay_MobileUI = (data, day, hiLo) => {
    // determine if its raining and returns path to a blue icon
    const precipitation = (icon) => {
        //09 == shower, 10 == rain, 11 == storm, 13 == snow, 50 == mist
        const rain_snow = ["09", "10", "11", "50", "13"];
        if (rain_snow.includes(icon.slice(0, 2))) {
            return true;
        }
        return false;
    };
    const swapIconForBlue = (icon) => {
        // tack "-blue.svg onto the name"
        const directory = "./SVG/";
        const ext = "-blue.svg";
        let newIcon = directory + icon.slice(0, 3) + ext;
        return newIcon;
    };

    // build the elements from top to bottom and populate with the weather Data        
    const fortyEightContainer = addElement("div", mainContainerMobile, {
        className: "forty-8-days",
    });

    // THe date
    addElement("div", fortyEightContainer, {
        className: "date-day",
        idName: "date-day-" + day,
        content: data[day].date,
    });
    const mainIcon = addElement("div", fortyEightContainer, {
        className: "main-icon",
    });
    // Main Weather Icon
    addElement("img", mainIcon, {
        src: `./SVG/${data[day].icon}.svg`,
        width: "65",
    });
    // Hi\lo temps
    addElement("div", fortyEightContainer, {
        className: "day-hi-lo",
        idName: "day-hi-lo-" + day,
        content: `<span class="hi">${hiLo.max}&#176</span> /</span><span class="lo">${hiLo.min}&#176</span>`,
    });

    // add the forecast for each hour of the day.
    for (let hour in data) {
        const hourContainer = addElement("div", fortyEightContainer, {
            // darken this cell if raining
            className: "hour", // set up a "rain" class CSS and add the classname if raining
        });
        // the time
        addElement("div", hourContainer, {
            className: "hour-cell-time",
            idName: "day-" + day + "-hour-" + hour, // "day-" + day + "-hour-" + hour (ha... LOL)
            content: data[hour].time,
        });

        const iconContainer = addElement("div", hourContainer, {
            className: "hour-cell-icon",
        });
        // Icon
        addElement("img", iconContainer, {
            idName: "day-" + day + "-hour-" + hour + "-icon", // "day-" + day + "-hour-icon-" + hour
            src: `./SVG/${data[hour].icon}.svg`,
            width: "18",
        });
        // Temp
        addElement("div", hourContainer, {
            className: "hour-cell-temp",
            idName: "hour-temp-" + hour,
            content: Math.round(data[hour].temp) + "&#176;",
        });

        // if its raining\snowing this hour, change the icon and add hour-rain-snow class
        if (precipitation(data[hour].icon)) {
            hourContainer.classList.add("hour-rain-snow");
            const icon = document.querySelector(
                "#day-" + day + "-hour-" + hour + "-icon"
            );

            icon.src = swapIconForBlue(data[hour].icon);
        }
    }

};



// creates a 2d array with all the data needed to forecast for the next 48hours. 
// The data in this array is then used to generate the forecast UI.
const getHourlyData = (weatherData) => {
    //
    const getHours = (unixTimeStamp) => {
        let date = new Date(unixTimeStamp * 1000);
        let hours = date.getHours();
        if (hours === 0) {
            hours = 0;
        }
        return hours;
    };
    const padWithZeros = (time) => {
        if (time.toString().length == 1) {
            time = "0" + time;
        }
        return time + ":00";
    };
    // the forecast may only span 2 actual days if its a certain time period.
    const getActualDays = (hour) => {
        // if the current time is between 0, 12am then only 2 days needs
        // to be built in the array
        if (hour == 0) return 2;
        return 3;
    };
    // gets the his and lows for each day. this info is not included in the hourly data, so i had to ref
    // daily as well
     const getHighsAndLows = (hourlyData, daily) => {
         let highsLows = [];
         const numDays = hourlyData.length;

         for (let i = 0; i < numDays; i++) {
             highsLows[i] = [
                 {
                     max: Math.round(daily[i].temp.max),
                     min: Math.round(daily[i].temp.min),
                 },
             ];
         }

         hourlyData.push(highsLows);
         return hourlyData;
     };
     

    // start logic
    const { hourly, daily } = weatherData;
    let day = 0;
    let totalHour = 0;
    let hourOnThisDay = 0;
    let hourlyDataByDay = [];

    // init 2D Array;
    // make sure there is an accuraat count on the days
    const numDays = getActualDays(getHours(hourly[totalHour].dt));
    for (let cnt = 0; cnt < numDays; cnt++) {
        hourlyDataByDay[cnt] = [];
    }

    while (totalHour <= 47) {
        hourlyDataByDay[day][hourOnThisDay] = {
            temp: hourly[totalHour].temp,
            icon: hourly[totalHour].weather[0].icon,
            time: `${padWithZeros(getHours(hourly[totalHour].dt))}`,
            date: getDateString(hourly[totalHour].dt),
        };

        hourOnThisDay++;

        if (getHours(hourly[totalHour].dt) == 23) {
            hourOnThisDay = 0; // start hours over for the next day
            day++;             // go to next day
        }
        
        totalHour++;
    }

    hourlyDataByDay = getHighsAndLows(hourlyDataByDay, daily);
    return hourlyDataByDay;
};



// creates a new element
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



// START TESTING CODE
// importing in test data so i dont have to acceess the API everytime
//import { testJsonData } from "./json-test-data.js";

//import { textData } from "../test.js";
export const twoDayForecastTest = (dom) => {
    // create the routines exactly as they are called with the real Data
    displayHourlyData(textData);
};
// END TEST CODE FOR FOrecast
