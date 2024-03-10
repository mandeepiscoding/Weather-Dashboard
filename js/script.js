const apiKey = '572282b7f91ae502ef8219c2fdccd87e';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

const searchForm = $('#search-form')[0]; // Convert to DOM element
const cityInput = $('#city-input'); // Convert to jQuery object
const currentWeatherContainer = $('#current-weather')[0]; // Convert to DOM element
const forecastContainer = $('#forecast')[0]; // Convert to DOM element
const searchHistoryContainer = $('#search-history')[0]; // Convert to DOM element

// Display search history
function displaySearchHistory() {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

  // Load search history from local storage
  if (!searchHistory) {
    localStorage.setItem("searchHistory", JSON.stringify([]));
    return;
  }
  searchHistoryContainer.innerHTML = '';
  searchHistory.forEach(searchTerm => {
    const searchItem = document.createElement('li');
    searchItem.textContent = searchTerm;
    searchItem.classList.add('search-history-item');
    searchHistoryContainer.appendChild(searchItem);
  });
}

// Update search history and display it
function updateSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  searchHistory.push(city);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  displaySearchHistory();
}

// Ensure the document is ready before executing JavaScript
$(document).ready(function () {
  const lastSearch = localStorage.getItem('lastSearch');
  if (lastSearch) {
    fetchWeather(lastSearch);
  }
  displaySearchHistory();

  // Initialize autocomplete on the city input field
  cityInput.autocomplete({
    source: cities // Use the array of cities defined above
  });
});

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const city = cityInput.val().trim(); // Use jQuery's val() method to get input value
  if (city) {
    fetchWeather(city);
    cityInput.val(''); // Use jQuery's val() method to set input value
    updateSearchHistory(city);
  }
});

// Handle clicking on search history items
searchHistoryContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('search-history-item')) {
    const city = event.target.textContent;
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(`${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    displayCurrentWeather(data);

    const forecastResponse = await fetch(`${apiUrl}forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();
    displayForecast(forecastData);

    // Store last search in local storage
    localStorage.setItem('lastSearch', city);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function displayCurrentWeather(data) {
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

  currentWeatherContainer.innerHTML = `
    <div class="weather-card">
      <h2>${data.name}</h2>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <img src="${iconUrl}" alt="Weather Icon">
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    </div>
  `;
}

function displayForecast(data) {
  forecastContainer.innerHTML = '';
  for (let i = 0; i < data.list.length; i++) {
    if (i % 8 === 0) { // Displaying every 8th entry, which corresponds to every 24 hours
      const forecast = data.list[i];
      const date = new Date(forecast.dt * 1000);
      const icon = forecast.weather[0].icon;
      const temp = forecast.main.temp;
      const windSpeed = forecast.wind.speed;
      const humidity = forecast.main.humidity;

      const forecastCard = document.createElement('div');
      forecastCard.classList.add('weather-card');
      forecastCard.innerHTML = `
        <h2>${date.toLocaleDateString()}</h2>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temp}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
      `;
      forecastContainer.appendChild(forecastCard);
    }
  }
}