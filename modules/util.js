
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

// given the day of the mpnth, will return the date in a String:
// ex. Mon Oct 6 2022
// if no Day is given returns today
export const DateString = (currTime) => {
   let now;
   if (currTime == null) {
      now = dayjs().date();
   } else {
      now = currTime;
   }
   
   const todayStr = dayjs().date(now).$d.toString();
   const todayDateStr = todayStr.split(" ").splice(0, 4).join(" ");
   // add a single comma after the day
   //todayDateStr.splice(3)
   return todayDateStr;
}

export const formatTime = (unixTimeStamp) => {
    const date = new Date(unixTimeStamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const formattedTime = hours + ":" + minutes.substr(-2);

    console.log(formattedTime)
    return formattedTime;
}

export const getDayFromTimeStamp = (timestamp) => {    
    let date = new Date(timestamp * 1000);
    let dom = date.getDate();
    return dom;
}

export const setMainIcon = (main, dom) => {
    
}


export const setBackground = (main, dom) => {
    const url = ["url(",  ")"];    
    const dir = "bg-images/";
    let fileName = "clear-BG.jpg";  // Default

    const setDarkColors = (dom) => {
      // call functioin to color for dark colors
      for (let i = 0; i < dom.conditionBorders.length; i++) {
        if (dom.conditionBorders[i].nodeName.toLowerCase() == "div") {
          dom.conditionBorders[i].style = "border: 1px solid black";
          dom.conditionBorders[i].style.color = "black";
        }
      }
      for (let i = 0; i < dom.daysBorders.length; i++) {
        if (dom.daysBorders[i].nodeName.toLowerCase() == "div") {
          dom.daysBorders[i].style = "border: 1px solid black";
          dom.daysBorders[i].style.color = "black";
        }
      }
    }
    
    switch (main) {
      case "Clear":
        fileName = "rainy-BG.jpg";
        setDarkColors(dom);

        break;
      case "Clouds":
        fileName = "cloudy-BG.jpg";
        setDarkColors(dom);

        break;
      case "Rain":
        fileName = "rainy-BG.svg";
        break;
      /*  
      case "Thunderstorm":
        fileName = "stormy.svg";
        break;
      case "Drizzle":
        fileName = "mist.svg";
        break;
      case "Snow":
        fileName = "snow.svg";
        break;
      case "Squall":
        fileName = "squalls.svg";
        break;
      case "Fog":
        fileName = "fog.svg";
        break;
      case "Tornado":
        path = "tornado.svg";
        break;
      case "Haze":
        path = "haze.svg";
        break;
        */
      default:
        fileName = fileName;
    } 
    url.splice(1, 0, dir + fileName);
    
    console.log(url);
    dom.backGround.style.backgroundImage = url.join("");
}
// given the description of the weather, return th}e path to the appropriate icon
export const getIcon = (main) => {
    const dir = "SVG/";
    let path;

    switch (main) {
      case "Clear":
        path = "sun.svg";
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
        path = "mist.svg";
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
    
    return `${dir}${path}`
}
