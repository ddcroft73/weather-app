
# Weather APP using OpeanWeather API

This app uses a free API so I negelected to hide the key. I am planning on building a proxy in-between to practice before I go all in to backend. I'm not a very good frontend designer, but I am learning. I learned a lot writing this app. I used no frameworks whatsoever and in doing so began to understand the need for them. Some of the UI was hardcoded, and some was dynamically generated. I planned for a while to rewrite the entire app, and make it all generated via JS, but on secondthought, I decined. I'm going to keeep it as is and look back as a reminder.

## Search Bar Component(psuedo component breakdown):
Basically its four different UI components. (OK My terminiolgy atm is incorrect but this was written as I understood it then.)
1. Search Bar.
  - This was a lot of fun. I basically stacked a bunch of divs together and then I styled them all in a way to mimic a text\select box that allows the user to Enter a location to serach. THe location may be saved, if needed and if its already been saved, will not save again. It has an oldschool windows feel to it and is as far as I can tell pretty self explanatory. I added a clear button to clear the box to facilitate the next search, and each location may be deleted as well. A search may be initiated with the enter key or withe the search button. So far it is not 100% responsive because I began to tire of it and I need to rewrite the entire component to make it work the way it should, more effeciently. I enjoyed theis so much it has made me decide to learn React, and Web Componnets as well. I can se this as either one? Maybe a standalone Web Component may be overkill but it would be really cool to be able to drop something like this into any web page and consume it with its only tag, and I am going to revisit the development of this. Maybe it will be good to learn REAct, but aybe at my currrent level it is too much.
2. Current Conditions.
  - This is just all the info about the current day.

3. Eight Day Forecast.
 - A flex container with flex container\items I decided to just take an east approach with: `flex-direction: row wrap;` If I did it aain I'd use a grid, but I still never have used grid and it looks a bit wonky, but it works fine in this way, and aside from some response issues wiht the `main-container`, and `centered-container` it came out well enough. Again, I'd do it diffeently if I went back and actually designed this app instead of starting with ab idea that ultimatley became something new every few days. This was and still is a beauiful learning experience app.

4. Forty-Eight Hour Forecast. Hour by Hour.
- This was a really nice addition. It gives a nice UI experience on both mobile and desktop, and it was at this point I began to dynamically generate the UI from the JSOn data. I began to realize how this could be built into a react componnet, yet I still had no idea what that was at the time. It just seeemed like it made moresense to dedicate a JS file to this and keep the code separate. I had to totally build a differnet UI for mobile and desktop, and i learned how to make them both avaiable. After I wrote this I took a break and started learning about front end frameworks. Still not there yet, but I'm getting there.

This has turned into quite a project. It started out as a simple way to get and produce the weather for a single location, and it ended up morphing into a functional app. That being said the structure went ape shit and I've been adding to it with pure frivolity. This was the epitome of a "Learning" app. I'd learn something, and implement it. I Have purposely left if vanilla JS. I am leatning ReactJS now but I did not use it in this app. I have learned a lot, and although I know I should rewrite this app to be well planned and more correctly structured. It works and it stays. I'll use it as a reminder.

## Features
 - Current weather information with:
   - Temperature
   - Weather displaying icon.
   - The Hi and low temps of the day
   - Text description.
 - 8 day forecast containing all the above info for each day.
 - Forty-eight hour forecast 
   - Hour by hour weather with icons for the next 48 hours.
   - Rainy\snowy days and nights are highlighted so you know with a glance.
 - Custom location Search box.
   - A combo option box that accepts text input.
   - Alows user to save and delete location.
 - Descriptive background images that change by the weather.
 - Colors update and highlight depending on the weather.
 
I stole a design addition from [Nick Place's](https://github.com/enPlace/top-weather-app) app. I went a step further and I used the "OneCall" API to get more data to work with. I got that idea from a past student: [Scotty](https://github.com/bscottnz/weather-app). I saw they used it and I liked the fact of doing more. The icons I used were a combination of "scotties" and an awesome library I found that was used by the weather app on my phone. [erik Flowers](https://erikflowers.github.io/weather-icons/). I heavily edited some of them, but left most intact.


### Proposed changes for desktop versus mobile.
 - Make the forty-eight hour forecast work horizantally rather than vertically to fill the screen. Thats it.

### To-DOs:
 - Change C to F and back (I don't know why I never did this.)
 - Desktop and Tablet views.
 - Add detailed info for each Day. (maybe)
 - Add Weather alerts:
    - I am making a WebComponnet to be used for this and wil double as a way to 
      show the daily details on desktop.
 - Hover-tips
    - Custom Element that allows you to insert tootips and all the functionality is encapsulated.
    - Will likely drop this app to explore that.
  
  View it [live]( https://ddcroft73.github.io/weather-app/).