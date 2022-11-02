
# Weather APP using OpeanWeather API

This weather app has been a lot of fun. I am almost positive that there are many things I have done, in opposition of "Best Practice". That being said, It has been a phenomanl learning experience even if I do have to re-learn some techniques. As I was building this applicatino I organically figured out the buzz about frontend frameworks. I used to balk at the thought, but now I want to learn. I attempted to learn Web Components. Or let me say, I am going to attempt to learn them. I have spent many hours reading about custom elements, shadowDom, and templates. I just have not attempted to actually make one. I decided to make a psuedo componet and I still plan on turning this code into one. I could actually have done the main part as one, the search combo box as another, the 48-hour-foecast, another and the weather maps, and alerts again as other ones. All seperate little applications I could add to a page via custom elements. The fact that I am so intriqued by WC's and not as much by React is... You can use a WC anywhere. 

In making the search commbo box I found that in order to call the API functions i had to import them into the class. That feels totally wrong and id like to venture into making them so that this is not necessary. Actuallly a lot of the problems I'm seeing could in fact be due to how this app evolved. A piece at a time. I started just intendng to get a locations weather and only produce a card of the current conditions. And kept going building on the same design and it became really hard to get where I've ended up and keep it all "clean and readable". It is to me, but my ultimate goal here is to design apps, and write them from a particular model and try not to stray so that it all stays clean. 

 I however did enjoy the JS and tweaking my code to work with all the different API calls. I went a step further and I used the "OneCall" API to get more data to work with. I got that idea from a past student: [Scotty](https://github.com/bscottnz/weather-app). I saw they used it and I liked the fact of doing more. The icons I used were a combination of "scotties" and an awesome library I found that was used by the weather app on my phone. [erik Flowers](https://erikflowers.github.io/weather-icons/). I heavily edited some of them, but left most intact.

I tried to add all the features I thought would be useful. I tried to mimic a lot of the features of "real" weather apps, with the hopes of creating something I could be proud of. In this endeavor people only really care about what they see and how "cool" it is. You need to be a student of WebDav to really appreciate some of the things I'm trying to do. My efforts always seem so lost on people I know... "Oh, yeh.. cool I guess."

I plan to rebuild the design of this app. I think this will be an exceptional project to try and utilize the use of a frontend framework. I'm not looking forward to that, but I need to make the plunge.

## Features
 - Current weather information with:
   - Temperature
   - Weather displaying icon.
   - The Hi and low temps of the day
   - Text description.
 - 8 day forecast containing all the above info for each day.
 - Forty-eight hour forecast (design I copied and really loved.)
   - Hour by hour weather with icons for the next 48 hours.
 - Custom location Search box.
   - A combo option box that accepts text input.
   - Alows user to save and delete location.
   - Locations can also be deleted.   
 - Descriptive background images that change by the weather.
 - Precipitation map of the local area.
 - Colors update and highlight depending on the weather.
 - Alerts
  - When there is sever weather a modal will popup displaying this.

  View it [live]( https://ddcroft73.github.io/weather-app/).