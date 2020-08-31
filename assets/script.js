$("#clearButton").hide()
$("#forecastBox").hide()
$("#currentWeatherIcon").hide()
$(".UV").hide()
let searchHistory = [] //empty array to store search items//
const historyList = $("#historyList")//HTML <ul> element to store search history//

//Load last searched city//
loadPreviousSearch()
function loadPreviousSearch() {
    let previousHistory = JSON.parse(localStorage.getItem("SearchHistory"))
    if (previousHistory) {
        $("#Current-Placeholder").empty()
        let previouslocation = previousHistory[previousHistory.length - 1]
        searchWeather(previouslocation)
        forecast(previouslocation)
    }
}

//Search bar//
$("#button-addon1").on("click", function () {
    $("#Current-Placeholder").empty()
    $("#dailyforcast").empty()
    //User input location//
    let userInput = $("#userCity").val().trim()
    if (userInput) {
        let location = userInput.charAt(0).toUpperCase() + userInput.slice(1)
        searchWeather(location)//display current weather//
        forecast(location)//display 5day weather forecast//
        //ADD SEARCH ITEM TO SEARCH HISTORY: If new search item is not present in array of search history, update local storage &list//
        if (searchHistory.indexOf(location) == -1) {
            //add to local storage//
            searchHistory.push(location)
            localStorage.setItem("SearchHistory", JSON.stringify(searchHistory))
            //display location on search history//
            let newLocation = $("<li>").attr("class", "list").text(location)
            historyList.append(newLocation)
            $("#clearButton").show()
            //allow user to click on list items to display weather//
            newLocation.on("click", function () {
                newLocation = location;
                clickHistory(location)
            })
        }
    }
})

//SEARCH HISTORY LIST//
//check if there are any history items in local storage//
let previousHistory = JSON.parse(localStorage.getItem("SearchHistory"))
if (previousHistory) {
    searchHistory = previousHistory
}
//Display previous search history//
if (searchHistory.length > 0) {
    $("#clearButton").show()
    for (let h = 0; h < searchHistory.length; h++) {
        let listItem = $("<li>").attr("class", "list").text(searchHistory[h]);
        historyList.append(listItem)
        //allow user to click on search history items//
        listItem.on("click", function () {
            let location = listItem.text()
            clickHistory(location)
        })
    }
}

//History list item click function//
function clickHistory(location) {
    $("#Current-Placeholder").empty()
    $("#dailyforcast").empty()
    searchWeather(location)
    forecast(location)
}

//clear search history option//
$("#clearButton").on("click", function () {
    localStorage.removeItem("SearchHistory");
    location.reload()
})

//CURRENT WEATHER//
function searchWeather(location) {
    $("#currentWeatherIcon").show()
    $(".UV").show()
    //URL for weather API//
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=07e46f2e34d3ec50a946d8cef79b24f7"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //display city's name
        const cityName = response.name
        $("#city").text(cityName + " (" + moment().format("DD/MM/YYYY") + ")")
        //current weather icon
        const currentIcon = response.weather[0].icon
        $("#currentWeatherIcon").attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")
        //display city's temperature
        const cityTemp = (response.main.temp - 273.15)
        $(".temperature").text("Temperature:  " + cityTemp.toFixed(0) + " C")
        //display city's humidity
        const cityHumidity = response.main.humidity
        $(".humidity").text("Humidity: " + cityHumidity + "%")
        //display city's wind speed
        const cityWind = response.wind.speed
        $(".wind").text("Wind Speed: " + cityWind + "MPH")
        //To obtain and display UV index use city's latitude and longitude in UV index API//
        const lat = response.coord.lat
        const lon = response.coord.lon
        uvIndex(lon, lat);
    })
}

//Current UV index of city// 
function uvIndex(lon, lat) {
    const uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=07e46f2e34d3ec50a946d8cef79b24f7&lat=" + lat + "&lon=" + lon
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (uvResponse) {
        const cityUV = uvResponse.value
        const UVdisplay = $(".uvValue")
        //color code UV index values//
        if (cityUV <= 2) {
            UVdisplay.attr("id", "green")
        }
        else if (cityUV > 2 && cityUV <= 5) {
            UVdisplay.attr("id", "yellow")
        }
        else if (cityUV > 5 && cityUV <= 7) {
            UVdisplay.attr("id", "orange")
        }
        else if (cityUV > 7) {
            UVdisplay.attr("id", "red")
        }
        UVdisplay.text(cityUV)
    })
}

//FIVE DAY WEATHER FORECAST//
//API provides weather forecast for every 3 hours in the next 5 days, daily averages need to be calculated with provided data//
const forcastRow = $("#dailyforcast")
function forecast(location) {
    const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=07e46f2e34d3ec50a946d8cef79b24f7 "

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (dayResponse) {
        //TEMPERATURE and HUMIDITY : 
        //obtain 3 hourly temperatures and humidity levels for the next five days from API and put them into daily arrays
        let dayOneTemp = []
        let dayTwoTemp = []
        let dayThreeTemp = []
        let dayFourTemp = []
        let dayFiveTemp = []
        let dayOneHumidity = []
        let dayTwoHumidity = []
        let dayThreeHumidity = []
        let dayFourHumidity = []
        let dayFivehumidity = []
        //Arrays to collect daily data (8x3hour segments for each day present in API)//
        for (let i = 0; i < 8; i++) {
            //collect 3 hourly temperatures from each day
            dayOneTemp.push(dayResponse.list[i].main.temp - 273.15)
            dayTwoTemp.push(dayResponse.list[i + 8].main.temp - 273.15)
            dayThreeTemp.push(dayResponse.list[i + 16].main.temp - 273.15)
            dayFourTemp.push(dayResponse.list[i + 24].main.temp - 273.15)
            dayFiveTemp.push(dayResponse.list[i + 32].main.temp - 273.15)
            //collect 3 hourly humidity levels from each day
            dayOneHumidity.push(dayResponse.list[i].main.humidity)
            dayTwoHumidity.push(dayResponse.list[i + 8].main.humidity)
            dayThreeHumidity.push(dayResponse.list[i + 16].main.humidity)
            dayFourHumidity.push(dayResponse.list[i + 24].main.humidity)
            dayFivehumidity.push(dayResponse.list[i + 32].main.humidity)
        }

        //TEMPERATURE AND HUMIDITY ARRAYS FOR EACH DAY//
        dayTempArray = [dayOneTemp, dayTwoTemp, dayThreeTemp, dayFourTemp, dayFiveTemp]
        dayHumidityArray = [dayOneHumidity, dayTwoHumidity, dayThreeHumidity, dayFourHumidity, dayFivehumidity]

        //Average daily temperature and humidity using values from arrays//
        for (let a = 0; a < 5; a++) {
            let temp = dayTempArray[a]
            totalTemp = 0

            let humidity = dayHumidityArray[a]
            totalHumidity = 0

            for (let x = 0; x < 8; x++) {
                totalTemp += temp[x]
                totalHumidity += humidity[x]
            }
            let averageTemp = (totalTemp / 8).toFixed(0)
            let averageHumidity = (totalHumidity / 8).toFixed(0)

            //create elements displaying date, weather icon, average temperature and humidity and append to HTML 
            $("#forecastBox").show()
            const cardBody = $("<div>").attr("class", "oneDay")
            const imgColumn = $("<div>").attr("class", "col-md-4")
            const textColumn = $("<div>").attr("class", "col-md-8")
            const date = $("<p>").attr("id", "forecastDates").text(moment().add(a, 'day').format("DD/MM/YYYY"))
            const icon = dayResponse.list[a * 8].weather[0].icon
            const iconImg = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
            const dailyForcastTemp = $("<p>").text("Temperature: " + averageTemp + " C")
            const dailyForcastHumidity = $("<p>").text("Humidity: " + averageHumidity + "%")
            forcastRow.append(cardBody)
            imgColumn.append(iconImg)
            textColumn.append(date, dailyForcastTemp, dailyForcastHumidity)
            cardBody.append(imgColumn, textColumn)
        }
    })
}
