# Weather Dashboard

## Introduction: 
This Weather Dashboard application was created for the user who wishes to check the current weather and 5 day forcast for any city. 
The following technologies were used to create it: 
* HTML, CSS and Javascript
* Open Weather Map API : to obtain JSON API for current weather, 5 day forecast and UV index for the user's chosen city. These API's were retreived from: https://openweathermap.org/api
* Moment.js was used to display the current date and dates in the 5 day forecast.
* Boostrap CSS framework was used to design the application and to ensure it is responsive. 

The application can be viewed with the folling link: https://shash833.github.io/Weather-Dashboard/.

## User Story: 
```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
```

When the user searches for a city, they will be presented with the current weather conditions obtained from the 'Current weather data' API as shown in the image below. 
The UV index was obtained from the 'UV index' and color-coded according to conditions set in Javascript to reflect its severity. 

```
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
```
Using the '5 day/3 hour Forecast' the temperature, humidity and weather icon were obtained for the next 5 days and displayed within their respective cards. As daily data was not available within this API, the averages of the temperature and humidity were calculated using javascript functions and displayed. The dates were displayed through the use of moment.js.

```
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```
With the use of local storage, any cities the user searches will be saved and displayed in a list below the search box. These list items are able to be clicked to display the weather conditions. 
The last saved item in the local storage will be displayed when the page loads. 

### Weather Dashboad image: 
![page-image](/assets/README-images/Webpage.PNG)