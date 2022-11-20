
# Weather APP using OpeanWeather API

This app uses a free API so I negelected to hide the key. I am planning on building a proxy in-between to practice before I go all in to backend. I'm not a very good frontend designer, but I am learning.

This has turned into quite a project. It started out as a simple way to get and produce the weather for a single location, and it ended up morphing into a functional app. That being said the structure went ape shit and I've been adding to it with pure frivolity. I have learned a lot, and although I know I should rewrite this app to be well planned and more correctly structured. It works and it stays. I'll use it as a reminder.

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