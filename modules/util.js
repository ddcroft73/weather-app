// module of JS utilitys

// API will always be called for fahrenheit, and then converted... the temps will be kept in an object that
// has both temps fpr each day we record.
//

export const showUI = () => {
    document.querySelector(".centered-container").style.visibility = "visible";     
    document.querySelector(".forecast-data-container").style.visibility = "visible";         
    document.querySelector(".spin").style.visibility = "hidden";          
}
export const getWindDirection = (degrees) => {
    // given the degrees return the closest direction via a path to the corresonding image
    const dir = "SVG/";
    const ext = ".svg";
    let direction;

    if(degrees >= 0 && degrees <= 23) {
         direction  = 'N';
    }
    if (degrees > 24 && degrees <= 45) {
         direction = "NE";
    }
    if (degrees > 45 && degrees <= 90) {
         direction = "E";
    }
    if (degrees > 90 && degrees <= 135) {
         direction = "SE";
    }
    if (degrees > 135 && degrees <= 180) {
         direction = "S";
    }
    if (degrees > 180 && degrees <= 225) {
        direction = "SW";
    }
    if (degrees > 225 && degrees <= 270) {
        direction = "W";
    }
    if (degrees > 270 && degrees <= 315) {
        direction = "NW";
    }
    if (degrees > 316 && degrees <= 360) {
        direction = "N";
    }


    return dir + direction + ext;
};
// convert F to C
export const findCelsius = (fahrenheit) => {
    const celsius = ((fahrenheit - 32) * 5) / 9;
    return celsius;
};

// C to F
export const findFahrenheit = (celsius) => {
    return (9 * celsius + 160) / 5;
};

export const getDateString = (unixTimeStamp) => {
    const dateString = dayjs(unixTimeStamp * 1000).$d.toString();
    return dateString.split(" ").splice(0, 4).join(" ");
};

export const formatTime = (unixTimeStamp) => {
    const date = new Date(unixTimeStamp * 1000);
    let hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    if (hours < 10) {
        hours = "0" + date.getHours();
    }
    const formattedTime = hours + ":" + minutes.slice(-2);
    return formattedTime;
};

export const isNight = (unixTimeStamp, offset) => {
    // Tue Oct 11 2022 18:58:27 GMT-0400
    try {
        const currHour = dayjs().hour();
        const currMinute = dayjs().minute();
        // extract the sunset time
        const date = dayjs(unixTimeStamp * 1000);
        const sunset = date.$d.toString().split(" ").splice(4, 1).join();
        const ssHour = sunset.split(":")[0];
        const ssMinute = sunset.split(":")[1];
        const ssHourInt = parseInt(ssHour, 10);
        const ssMinuteInt = parseInt(ssMinute, 10);

        //const now = currHour.toString() + currMinute.toString();
        //const sunDown = ssHour + ssMinute;
        //console.log(now, sunDown);
        //console.log(ssHourInt, ssMinuteInt, currHour, currMinute);
        if (
            currHour > ssHourInt ||
            (currHour === ssHourInt && currMinute > ssMinuteInt) ||
            (currHour - 1 === ssHourInt && ssMinuteInt > currMinute)
        ) {
            return true;
        } else if (currHour <= 6) {
            // midnight. definitley dark  === 0
            return true;
        }

        return false;
    } catch (err) {
        alert(err.message);
    }
};

// removes unneeded fluff on names in order to shorten them.
export const evalName = (name) => {
    // if there is "County" in the name, remove it and return the town name.
    const nameArray = name.split(" ");
    if (nameArray.includes("County")) {
        name = nameArray.join("").replace("County", "");
    }
    // capitialize all words before returning
    return capAllWords(name);
};

export const capAllWords = (string) => {
    return string.replace(/\w\S*/g, (w) =>
        w.replace(/^\w/, (c) => c.toUpperCase())
    );
};

// sets the back gorund depending on the type of weather. supports differnt types of cloads, rain, snow
// and storms
export const setBackground = (main, description,  night) => {
    const url = ["url(", ")"];
    const dir = "bg-images/";
    const submit = document.querySelector("#submit");
    const deleteBut = document.querySelector("#delete");
    //const dayBackground = document.querySelector(".day");
    const backGround = document.querySelector(".main-container");
    const conditionBorders = document.getElementById("conditionsBorders").childNodes;
    const daysBorders = document.getElementById("daysBorders").childNodes;
    //const header = document.querySelector(".search");
    const body = document.querySelector("body");
    const leftInfo = document.querySelector(".inner-left");
    //const rightInfo = document.querySelector(".inner-right");

    const insideDayNodes = document.querySelectorAll(".inside-day-container div");
    let fileName = "clear-BG.jpg"; // Default
    
    // sets the colors to correspond to the weather pattern.
    const setColors = (borderColor, bgColor, accentColor) => {

        if (night) {
            body.style = "background-color: black;";
            submit.style.color = 'white';
            deleteBut.style.color = 'white';
        } else {
            body.style = `background-color: ${bgColor};`;
        }

        leftInfo.style = `border: 1px solid ${borderColor};`;
      //  rightInfo.style = `border: 1px solid ${borderColor};`;

        backGround.style = `border: 1px solid ${borderColor};`;
        
        // change all the text to a differnet color except the Temp
        // If no value is passd in nothing changes
        // I actually dont even use this.. but it took me a while to get it right so
        // in it stays
        for (let i = 0; i < insideDayNodes.length; i++) {
            if (
                insideDayNodes[i].nodeName.toLowerCase() == "div" &&
                insideDayNodes[i].className != "day-temp"
            ) {
                insideDayNodes[i].style.color = accentColor;
            }
        }        

        // the condition divs
        //for (let i = 0; i < conditionBorders.length; i++) {
        //    if (conditionBorders[i].nodeName.toLowerCase() == "div") {
              //  conditionBorders[i].style = `border: 1px solid ${borderColor};`;
                //dom.conditionBorders[i].style.color = color;
        //    }
        //}
        // the day cards .what-day
        for (let i = 0; i < daysBorders.length; i++) {
            if (daysBorders[i].nodeName.toLowerCase() == "div") {
                daysBorders[i].style = `border: 1px solid ${borderColor};`;
                //dom.daysBorders[i].style.color = color;
            }
        }
        
    };

    // slice off the first word in the description to use to select the right BG image
    description = description.split(" ")[0];

    /* Lazy mans TDD */
    //main = 'Fog';
    //description = 'powerful';
    //console.log(main, description);

    switch (main) {
        case "Clear":
            if (night) {
                fileName = "night-clear-BG.jpg";                
                setColors("#f5f5f5", "#181D26");
            } else {
                fileName = "clear-BG.jpg";
                setColors( "#f5f5f5", "#77BEF2");
            }
            break;

        case "Clouds":
            if (night) {
                description = "night";
               setColors("orange", "#181717");
            } else {
               setColors("orange", "#3F5968");
            }

            fileName = description + "-clouds-BG.jpg";
            break;

        case "Rain":
            // 3 types of rain are enough...
            if (
                description != "moderate" &&
                description != "heavy" &&
                description != "freezing"
            ) {
                fileName = "moderate-rain-BG.jpg";
            } else {
                fileName = description + "-rain-BG.jpg";
            }
            setColors("#F2ED08", "#282221");
            break;

        // just thunderstorm, one is plenty
        case "Thunderstorm":
            fileName = "thunderstorm-BG.jpg";
            setColors("white", "#25140E");
            break;

        case "Drizzle":
            fileName = "drizzle-BG.jpg";
            setColors("#F0C306", "#061311", "#F8F2ED");
            break;

        case "Mist":
            if (night) {
                fileName = "night-misty-BG.jpg";                
               setColors("#F59D02", "#100A05");
            } else {
                fileName = "misty-BG.png";
               setColors("#F59D02", "#344731");
            }
            break;
        case "Haze":
            if (night) {
                fileName = "night-misty-BG.jpg";
                setColors("#F59D02", "#100A05");
            } else {
                fileName = "misty-BG.png";
                setColors("#F59D02", "#344731");
            }
            break;
        case "Snow": // light heavy snow sleet
            if (night) {
                fileName = "night-snow-BG.jpg";                
                setColors("white", "#0D142A");
            } else {
                fileName = "snow-BG.jpg";
                setColors("white", "#A55E1F");
            }
            break;

        case "Squall":
            fileName = "squall-BG.jpg";
            setColors("#272F30", "#465E61");
            break;

        case "Fog":
            if (night) {
                fileName = "night-fog-BG.jpg";
                 setColors("#12C4C6", "#172B37");
            } else {
                fileName = "fog-BG.jpg";
                setColors("#12C4C6", "#86A16C");
            }
            break;

        case "Tornado":
            fileName = "tornado-BG.jpg";
            setColors("#F3C908", "#3D5353");
            break;

        default:
            fileName = fileName;
    }
    url.splice(1, 0, dir + fileName);

    //console.log(url);
    backGround.style.backgroundImage = url.join("");
};

// given the description of the weather, return th}e path to the appropriate icon
export const getIcon = (night, icon, main, description) => {
    const dir = "SVG/";
    const ext = ".svg";
    let path;
    /*
  main = 'Snow';
  description = 'light shower rain'
  night = true;*/
    //console.log(`Main: ${main}\nDescription: ${description}`);

    // Showers
    if (
        (main === "Rain" && description.split(" ").includes("shower")) ||
        (main === "Rain" && description.split(" ").includes("light"))
    ) {
        icon = "showerd";
    }
    //Sleet, mix rain and snow
    if (
        main === "Snow" ||
        (main === "Sleet" && description.split(" ").includes("snow")) ||
        (main === "Sleet" && description.split(" ").includes("rain"))
    ) {
        icon = "sleetd";
    }
    
    if (night) {
        icon = icon.replace("d", "n");
    }

    path = dir + icon + ext;
    return path;
};
