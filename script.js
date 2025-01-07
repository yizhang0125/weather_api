document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const submitBtn = document.getElementById('submit-btn');
    const errorMessage = document.getElementById('error-message');
    const weatherInfo = document.getElementById('weather-info');
    const cityName = document.getElementById('city-name');
    const currentDate = document.getElementById('current-date');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const pressure = document.getElementById('pressure');
    const forecastContainer = document.getElementById('forecast-container');

    // Your actual WeatherAPI key
    const API_KEY = '8e306c4d8c6849068c415159250701'; 
    const API_URL = 'https://api.weatherapi.com/v1/current.json';
    const FORECAST_API_URL = 'https://api.weatherapi.com/v1/forecast.json';

    // Set default values on page load
    function setDefaultValues() {
        cityName.textContent = '--'; // Default value for city name
        currentDate.textContent = '--'; // Default value for date
        temperature.textContent = '--'; // Default value for temperature
        description.textContent = '--'; // Default value for description
        humidity.textContent = '--'; // Default value for humidity
        windSpeed.textContent = '--'; // Default value for wind speed
        pressure.textContent = '--'; // Default value for pressure
        forecastContainer.innerHTML = ''; // Clear forecast items
        weatherInfo.classList.remove('d-none'); // Show weather info section
    }

    // Call the function to set default values initially
    setDefaultValues();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();

        if (!city) return;

        submitBtn.disabled = true; // Disable button during fetch
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        errorMessage.classList.add('d-none'); // Hide error message
        weatherInfo.classList.add('d-none'); // Hide weather info

        try {
            const weatherData = await fetchWeatherData(city);
            updateWeatherInfo(weatherData);
            const forecastData = await fetchForecastData(city);
            updateForecast(forecastData);
        } catch (err) {
            showError('Failed to fetch weather data. Please try again.');
        } finally {
            submitBtn.disabled = false; // Re-enable button after fetch
            submitBtn.innerHTML = '<i class="fas fa-search"></i>'; // Reset button content
        }
    });

    async function fetchWeatherData(city) {
        const url = `${API_URL}?key=${API_KEY}&q=${city}&aqi=no`;
        console.log('Fetching weather data from:', url); // Log the URL
        const response = await fetch(url);

        if (!response.ok) throw new Error('City not found');
        return response.json();
    }

    async function fetchForecastData(city) {
        const url = `${FORECAST_API_URL}?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`;
        console.log('Fetching forecast data from:', url); // Log the URL
        const response = await fetch(url);

        if (!response.ok) throw new Error('Forecast data not available');
        return response.json();
    }

    function updateWeatherInfo(data) {
        cityName.textContent = `${data.location.name}, ${data.location.country}`;
        currentDate.textContent = new Date().toLocaleDateString();

        temperature.textContent = `${Math.round(data.current.temp_c)}°C`;
        description.textContent = data.current.condition.text; // Weather description
        humidity.textContent = `${data.current.humidity}%`;
        windSpeed.textContent = `${data.current.wind_kph} kph`; // Wind speed in kph
        pressure.textContent = `${data.current.pressure_mb} hPa`; // Pressure in hPa
        
        weatherInfo.classList.remove('d-none'); // Show weather info section
     }

     function updateForecast(data) {
       forecastContainer.innerHTML = ''; // Clear previous forecast

       data.forecast.forecastday.forEach(day => {
           const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
           const tempMax = Math.round(day.day.maxtemp_c);
           const tempMin = Math.round(day.day.mintemp_c);
           const iconUrl = `https:${day.day.condition.icon}`; // Icon URL

           // Create forecast item
           const forecastItem = `
               <div class='forecast-item col'>
                   <h5>${dayName}</h5>
                   <img src='${iconUrl}' alt='${day.day.condition.text}'>
                   <p>${tempMax}°C / ${tempMin}°C</p>
               </div>`;
           
           forecastContainer.innerHTML += forecastItem; // Append to forecast container
       });
       
       document.querySelector('.forecast').classList.remove('d-none'); // Show forecast section
     }

     function showError(message) {
       errorMessage.textContent = message; // Set error message text
       errorMessage.classList.remove('d-none'); // Show error message
     }
});
