// Global variables for temperature and location state
let currentTempF = null;
let currentTempC = null;
let currentUnit = 'F'; // Default temperature unit
let locationGranted = false; // Track geolocation status

// Function to update the live clock every second
function updateClock() {
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    clockEl.textContent = new Date().toLocaleTimeString();
  }
}
setInterval(updateClock, 1000);

// DOM elements
const cityInput = document.getElementById('city-input');
const suggestionsDiv = document.getElementById('suggestions');
const modal = document.getElementById('modal');
const modalRetryBtn = document.getElementById('modal-retry-btn');
const modalDismissBtn = document.getElementById('modal-dismiss-btn');
const tempUnitEl = document.getElementById('temperature-unit');
const refreshBtn = document.getElementById('refresh-btn');
const bgVideo = document.getElementById('bg-video');

// Autocomplete: Use WeatherAPI's search endpoint for dynamic city suggestions
cityInput.addEventListener('input', async () => {
  const inputVal = cityInput.value.trim();
  suggestionsDiv.innerHTML = '';
  if (inputVal.length === 0) return;
  try {
    const lookupUrl = `http://api.weatherapi.com/v1/search.json?key=47e3da6b68e044efb8a51624250902&q=${inputVal}`;
    const response = await fetch(lookupUrl);
    if (!response.ok) throw new Error(`Lookup API error: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data)) {
      data.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        div.textContent = `${item.name} (${item.region}, ${item.country})`;
        div.addEventListener('click', () => {
          cityInput.value = item.name;
          suggestionsDiv.innerHTML = '';
          fetchWeather(item.name);
        });
        suggestionsDiv.appendChild(div);
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// Function to update the background video and fallback image based on weather condition
function updateBackground(condition) {
  const body = document.body;
  condition = condition.toLowerCase();
  let videoSrc = "";
  // Replace these placeholder video URLs with your actual MP4 links if available
  if (condition.includes("clear")) {
    videoSrc = "https://www.example.com/videos/sunny.mp4";
  } else if (condition.includes("cloud")) {
    videoSrc = "https://www.example.com/videos/cloudy.mp4";
  } else if (condition.includes("rain")) {
    videoSrc = "https://www.example.com/videos/rain.mp4";
  } else if (condition.includes("snow")) {
    videoSrc = "https://www.example.com/videos/snow.mp4";
  } else if (condition.includes("thunder")) {
    videoSrc = "https://www.example.com/videos/thunderstorm.mp4";
  } else {
    videoSrc = "https://www.example.com/videos/default.mp4";
  }
  if (bgVideo) {
    bgVideo.src = videoSrc;
  }
  // Fallback background image from Unsplash
  let bgUrl = "";
  if (condition.includes("clear")) {
    bgUrl = "url('https://source.unsplash.com/1600x900/?sunny')";
  } else if (condition.includes("cloud")) {
    bgUrl = "url('https://source.unsplash.com/1600x900/?cloudy')";
  } else if (condition.includes("rain")) {
    bgUrl = "url('https://source.unsplash.com/1600x900/?rain')";
  } else if (condition.includes("snow")) {
    bgUrl = "url('https://source.unsplash.com/1600x900/?snow')";
  } else if (condition.includes("thunder")) {
    bgUrl = "url('https://source.unsplash.com/1600x900/?thunderstorm')";
  } else {
    bgUrl = "url('https://source.unsplash.com/1600x900/?weather')";
  }
  body.style.backgroundImage = bgUrl;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.animation = "bgFade 2s ease-in-out";
}

// Add keyframes for background fade animation
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `@keyframes bgFade { from { opacity: 0.8; } to { opacity: 1; } }`;
document.head.appendChild(styleSheet);

// Function to fetch weather data by city or via geolocation
async function fetchWeather(city = null) {
  let weatherUrl = '';
  if (city) {
    weatherUrl = `http://api.weatherapi.com/v1/current.json?key=47e3da6b68e044efb8a51624250902&q=${city}&aqi=yes`;
    await getWeatherData(weatherUrl);
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        locationGranted = true;
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        weatherUrl = `http://api.weatherapi.com/v1/current.json?key=47e3da6b68e044efb8a51624250902&q=${lat},${long}&aqi=yes`;
        await getWeatherData(weatherUrl);
      }, error => {
        console.error("Geolocation error:", error);
        locationGranted = false;
        showModal("We couldn't retrieve your location. Please enable location access in your browser settings for a personalized forecast.");
      });
    } else {
      document.querySelector('.location-timezone').textContent = "Geolocation not supported.";
    }
  }
}

// Function to fetch main weather data and update the DOM
async function getWeatherData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    const weatherData = await response.json();
    console.log("Weather Data:", weatherData);
    
    document.querySelector('.location-timezone').textContent = weatherData.location.name;
    currentTempF = weatherData.current.temp_f;
    currentTempC = weatherData.current.temp_c;
    
    if (currentUnit === 'F') {
      document.querySelector('.temperature-degree').textContent = Math.round(currentTempF);
      tempUnitEl.textContent = "°F";
    } else {
      document.querySelector('.temperature-degree').textContent = Math.round(currentTempC);
      tempUnitEl.textContent = "°C";
    }
    
    document.querySelector('.temperature-description').textContent = weatherData.current.condition.text;
    let iconUrl = weatherData.current.condition.icon;
    if (iconUrl.startsWith("//")) {
      iconUrl = "https:" + iconUrl;
    }
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = iconUrl;
    
    if (weatherData.current.condition.text.toLowerCase().includes("rain")) {
      weatherIcon.classList.add("rainy");
    } else {
      weatherIcon.classList.remove("rainy");
    }
    
    if (weatherData.current.air_quality) {
      const pm25 = weatherData.current.air_quality.pm2_5;
      let quality = "Not available";
      if (pm25 !== undefined) {
        if (pm25 < 12) quality = "Good";
        else if (pm25 < 35) quality = "Moderate";
        else quality = "Poor";
      }
      document.getElementById('aq-description').textContent = `Air Quality: ${quality} (PM2.5: ${pm25 ? pm25.toFixed(1) : "--"})`;
    } else {
      document.getElementById('aq-description').textContent = "Air quality data not available.";
    }
    
    updateBackground(weatherData.current.condition.text);
    
    // After fetching weather, fetch news as well
    fetchNews();
    
  } catch (error) {
    console.error(error);
    document.querySelector('.temperature-description').textContent = "Unable to fetch weather data.";
    document.getElementById('aq-description').textContent = "Unable to fetch air quality data.";
  }
}

// Function to fetch news using your provided news API endpoint
async function fetchNews() {
  try {
    const newsUrl = "https://newsdata.io/api/1/news?apikey=pub_68607099a85dfe4a75217e162cb2e74516468&q=news&country=in,jp,ru,lk,tr&language=en";
    const response = await fetch(newsUrl);
    if (!response.ok) throw new Error(`News API error: ${response.status}`);
    const newsData = await response.json();
    console.log("News Data:", newsData);
    const newsDiv = document.getElementById('news');
    newsDiv.innerHTML = "";
    if (newsData.results && Array.isArray(newsData.results)) {
      newsData.results.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('news-item');
        const titleLink = document.createElement('a');
        titleLink.href = article.link;
        titleLink.textContent = article.title;
        titleLink.target = "_blank";
        articleDiv.appendChild(titleLink);
        newsDiv.appendChild(articleDiv);
      });
    } else {
      newsDiv.textContent = "No news available.";
    }
  } catch (error) {
    console.error(error);
    document.getElementById('news').textContent = "Unable to fetch news.";
  }
}

// Toggle temperature unit on click
tempUnitEl.addEventListener('click', () => {
  if (currentTempF === null || currentTempC === null) return;
  if (currentUnit === 'F') {
    currentUnit = 'C';
    document.querySelector('.temperature-degree').textContent = Math.round(currentTempC);
    tempUnitEl.textContent = "°C";
  } else {
    currentUnit = 'F';
    document.querySelector('.temperature-degree').textContent = Math.round(currentTempF);
    tempUnitEl.textContent = "°F";
  }
});

// Modal functionality: show modal with custom message
function showModal(message) {
  modal.style.display = "flex";
  document.getElementById('modal-message').textContent = message;
}

// Modal buttons: on retry, alert the user then attempt to fetch current location weather
modalRetryBtn.addEventListener('click', () => {
  alert("Please check your browser settings and enable location access to view your local forecast.");
  modal.style.display = "none";
  fetchWeather();
});
modalDismissBtn.addEventListener('click', () => {
  modal.style.display = "none";
  document.querySelector('.location-timezone').textContent = "Please enter your city below.";
});

// Always fetch current location weather when refresh button is clicked
refreshBtn.addEventListener('click', () => {
  fetchWeather();
});
