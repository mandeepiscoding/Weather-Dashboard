const apiKey = '572282b7f91ae502ef8219c2fdccd87e';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast');
const popularCitiesList = document.getElementById('popular-cities-list');

// Load weather data from local storage if available
document.addEventListener('DOMContentLoaded', () => {
  const lastSearch = localStorage.getItem('lastSearch');
  if (lastSearch) {
    fetchWeather(lastSearch);
  }
});

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    cityInput.value = '';
  }
});

popularCitiesList.addEventListener('click', function(event) {
  if (event.target.classList.contains('popular-city')) {
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
  currentWeatherContainer.innerHTML = `
    <div class="weather-card">
      <h2>${data.name}</h2>
      <p>Date: ${new Date().toLocaleDateString()}</p>
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