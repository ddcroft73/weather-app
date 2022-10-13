
// module of JS utilitys


// API will always be called for fahrenheit, and then converted... the temps will be kept in an object that
// has both temps fpr each day we record.
//
// convert F to C
export const findCelsius = (fahrenheit) => {
  const celsius = ((fahrenheit - 32) * 5) / 9;
  return celsius;
}

// C to F
export const findFahrenheit = (celsius) => {
  return (9 * celsius + 160) / 5;
}


export const getDateString = (unixTimeStamp) => {
     const dateString = dayjs(unixTimeStamp * 1000).$d.toString();
     return dateString.split(" ").splice(0, 4).join(" ");
}

export const formatTime = (unixTimeStamp) => {
    const date = new Date(unixTimeStamp * 1000);
    let hours = date.getHours();
    const minutes = "0" + date.getMinutes();    
    if (hours < 10) {hours = "0" + date.getHours();}
    const formattedTime = hours + ":" + minutes.slice(-2);
    return formattedTime;
}

export const getDayFromTimeStamp = (timestamp) => {    


    let date = new Date(timestamp * 1000);
    let doMth = date.getDate();
    return doMth;
}
export const isNight = (unixTimeStamp) => {
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
        (currHour > ssHourInt) || 
        (currHour === ssHourInt) && currMinute > ssMinuteInt || 
        ((currHour-1) === ssHourInt && ssMinuteInt > currMinute)
       ) {
        console.log('true')
        return true;
    } 

    return false;

  } catch (err) {
    alert(err.message);
  }
  
}

// sets the back gorund depending on the type of weather. supports differnt types of cloads, rain, snow
// and storms
export const setBackground = (main, dom, description, sunsetUnixTime) => {
    const url = ["url(",  ")"];    
    const dir = "bg-images/";
    const night = isNight(sunsetUnixTime);

    let fileName = "clear-BG.jpg";  // Default

    // sets the colors to correspond to the weather pattern.
    const setColors = (dom, color) => {      
        dom.backGround.style = `border: 1px solid ${color};`;
        dom.location.style = `border: 1px solid ${color};`;
        dom.clear.style = `border: 1px solid ${color};`;
        dom.submit.style = `border: 1px solid ${color};`;
        // the condition divs
        for (let i = 0; i < dom.conditionBorders.length; i++) {
          if (dom.conditionBorders[i].nodeName.toLowerCase() == "div") {
            dom.conditionBorders[i].style = `border: 1px solid ${color};`;
            dom.conditionBorders[i].style.color = color;
          }
        } 
        // the day cards
        for (let i = 0; i < dom.daysBorders.length; i++) {
          if (dom.daysBorders[i].nodeName.toLowerCase() == "div") {
            dom.daysBorders[i].style = `border: 1px solid ${color};`;
            dom.daysBorders[i].style.color = color;
          }
        }
      }
    
    // is it day or night? decide if it is day or night and then pick the appropriate images?

    // slice off the first word in the description to use to select the right BG image
    description = description.split(" ")[0];    

    /* Lazy mans TDD */
       //main = 'Tornado';
       //description = 'powerful';
    console.log(main, description);

    switch (main) {
      case "Clear":
        if (night) {
          fileName = "night-clear-BG.jpg";
        } else {
          fileName = "clear-BG.jpg";
        }
        setColors(dom, "white");
        break;

      case "Clouds":
        if (night) {
          description = "night";
        }
        fileName = description + "-clouds-BG.jpg";
        setColors(dom, "orange");
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
        setColors(dom, "black");
        break;

      // just thunderstorm, one is plenty
      case "Thunderstorm":
        fileName = "thunderstorm-BG.jpg";
        setColors(dom, "black");
        break;

      case "Drizzle":
        fileName = "drizzle-BG.jpg";
        setColors(dom, "black");
        break;

      case "Mist":
        if (night) {
          fileName = "night-misty-BG.jpg";
        } else {
          fileName = "misty-BG.png";
        }
        setColors(dom, "black");
        break;

      // resume here
      case "Snow": // light heavy snow sleet
        if (night) {
          fileName = "night-snow-BG.jpg";
        } else {
          fileName = "snow-BG.jpg";
        }
        setColors(dom, "blue");
        break;

      case "Squall":
        fileName = "squall-BG.jpg";
        setColors(dom, "black");
        break;

      case "Fog":
        if (night) {
          fileName = "night-fog-BG.jpg";
        } else {
          fileName = "fog-BG.jpg";
        }
        setColors(dom, "black");
        break;

      case "Tornado":
        fileName = "tornado-BG.jpg";        
        setColors(dom, "maroon")
        break;

      case "Haze":
        fileName = "haze.svg";
        break;

      default:
        fileName = fileName;
    } 
    url.splice(1, 0, dir + fileName);
    
    console.log(url);
    dom.backGround.style.backgroundImage = url.join("");
}
// given the description of the weather, return th}e path to the appropriate icon
export const getIcon = (main, sunsetUnixTime) => {
  const dir = "SVG/";
  let path;
  const night = isNight(sunsetUnixTime);

  switch (main) {
    case "Clear":
      if (night) {
        path = "moon.svg";
      } else {
        path = "sun.svg";
      }
      break;
    case "Clouds":
      path = "cloudy.svg";
      break;
    case "Rain":
      path = "rainy.svg";
      break;
    case "Thunderstorm":
      path = "stormy.svg";
      break;
    case "Drizzle":
      path = "rainy.svg";
      break;

    case "Mist":
      path = "rainy.svg";
      break;

    case "Snow":
      path = "snow.svg";
      break;
    case "Squall":
      path = "squalls.svg";
      break;
    case "Fog":
      path = "fog.svg";
      break;
    case "Tornado":
      path = "tornado.svg";
      break;
    case "Haze":
      path = "haze.svg";
      break;
    default:
      path = "arrow_left.svg";
  }

  return `${dir}${path}`;
};


export const handleError = (error) => {
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