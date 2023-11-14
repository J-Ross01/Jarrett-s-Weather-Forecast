var apiKey = "f1e8fc7ef3c609c05907e1b51cc33428";
var Url = "https://api.openweathermap.org/data/2.5/";

var searchbtn = document.querySelector("#search-btn");
var cityName = document.querySelector("#input-city");
var currentWeather = document.querySelector("#current-weather");
var forecastContainer = document.querySelector("#forecast-container");
var forecasthistory = document.querySelector("#history-list");

searchbtn.addEventListener("click", function() {
    var city = cityName.value.trim(); //The trim is used to eliminate any white spaces from the inputted string. 
    if (city) {
        getWeather(city); //This should fetch the weather data for the inputted city. 
        saveSearchHistory(city); //Will save the string into a local storage. 
    } else { 
        alert("Please enter a city name"); //An alert shoud appear if the user doesn't input a city string and clicks on search. 
    }
});

function getWeather(city) { //This should fetch the weather data for the city name that gets inputted.
    fetch(`${Url}weather?q=${city}&appid=${apiKey}&units=imperial`) //Commences an asynchronous request to get weather data using the 'fetch' function. Making sure that upon request the API key is available. Once the data is outputted it will be in imperial units. 
      .then(response => response.ok ? response.json() : Promise.reject(`Error: ${response.statusText}`)) //Checks if the weather data response is successful and then converts the reponse to JSON. If there is an error rejects the promise with the error message. 
      .then(data => {
        displayCurrentWeather(data); //This should display the Current weather data. 
        return fetch(`${Url}forecast?q=${city}&appid=${apiKey}&units=imperial`); //Another 'fetch' but to get the forecast data for the same city. 
      })
      .then(response => response.ok ? response.json() : Promise.reject(`Error: ${response.statusText}`))
      .then(displayForecast) //When forecast data is fetched successfully, it should display the forecast information.
      .catch(handleError); //Will handle the error by displaying an error message.
  }
  

function displayCurrentWeather(weatherData) { 
    currentWeather.innerHTML = ''; //Clears any existing weather data, so it could make room for storing the next set of weather data content. 
    var weatherHTML = ` 
    <h3>Current Weather for ${weatherData.name}</h3>
    <p>Temperature: ${weatherData.main.temp} °F</p>
    <p>Humidity: ${weatherData.main.humidity}%</p>
    <p>Wind Speed: ${weatherData.main.windSpeed} mph</p>
    `; // Created a string template in order to store the Api object's weather data in a structured form. 
    currentWeather.innerHTML = weatherHTML; // This will store the newly created HTML string data and will change when new "current-weather" data is searched. 
}


function displayForecast(forecastData) {
    forecastContainer.innerHTML = ''; //Does the same action as line 21 but for the forecast-cotainer element. 

    forecastData.list.forEach(function(forecast, index) { //"You can search weather forecasts for 5 days with data every 3 hours by geographic coordinates. All weather data can be obtained in JSON and XML formats."-(https://openweathermap.org/forecast5)
        if (index % 8 === 0) { // In 24 hours of weather forecast, I should be getting about eight data points a day because the API updates every three hours. 
            var forecastHtml = `
                <div class="forecast">
                    <h4>${new Date(forecast.dt_txt).toDateString()}</h4>
                    <p>Temperature: ${forecast.main.temp} °F</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed} mph</p>
                </div>
            `; //Same function as lines (23-26) with the exception of line 39 exspressing a new Date object which should be a string representation coming from the forecast data. 

        forecastContainer.innerHTML += forecastHtml;
        }//This will store the newly created HTML string data and will change when new "forecast-container" data is searched.
    });
}

function saveSearchHistory(city) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []; //This will take the search history from local storage. Once the item is retrieved it will convert the Json String into a JavaScript array '[]'.
    if (!searchHistory.includes(city)) { 
        searchHistory.push(city); //The city name is inputted into the search history array. 
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); //Updates the local storage search history.
    }

    loadSearches(); //Calls the loadSearches function to update the displayed search history. 
}

function loadSearches() { //Retreives and parses the search history from local storage. 

    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []; 
    forecasthistory.innerHTML = ''; //Clears existing content in the 'forecasthistory' element in order to display the new search history. 
    searchHistory.forEach(function(city) { // This loop should repeat in each city name in the search history array. 
        var li = document.createElement('li'); // Creates new li item for each city name and sets the text content to the city name. 
        li.textContent = city; 
        li.addEventListener('click', function() {
            getWeather(city); // Adds an event listener to each list item when clicked. This will call `getWeather(city)` for each city name and fetch the weather data. 
        });
        forecasthistory.appendChild(li); //Appends each new list item to the forecasthistory element, adding it to the displayed list on the webpage.
    });
}

function handleError(error) { //Logs any errors that may occur during the execution of other functions in my JavaScript. 
    console.error('Error:', error)
    alert(error.message || "Error occurred");//If the error message is falsy then the string "Error occurred" will be displayed. 
}

loadSearches();