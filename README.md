# WeatherPro - Live Weather Dashboard

## Overview
WeatherPro is a modern, responsive weather dashboard that provides real-time weather information, air quality data, and weather-related news. Built with vanilla JavaScript, HTML5, and CSS3, it offers a clean and intuitive interface for checking weather conditions worldwide.

## Features
- **Real-time Weather Updates**: Get current weather conditions for any city
- **Default City**: Bangalore weather displayed by default
- **Air Quality Information**: Includes PM2.5 measurements and quality ratings
- **Live Clock**: Displays current time
- **Temperature Units**: Toggle between Fahrenheit and Celsius
- **Weather News**: Latest weather-related news updates
- **City Search**: Auto-complete city search functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Dynamic Backgrounds**: Background changes based on weather conditions

## Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection
- API keys for weather and news services


## Usage

1. **City Search**
   - Type a city name in the search bar
   - Select from autocomplete suggestions
   - Press Enter or click on a suggestion to get weather data

2. **Temperature Toggle**
   - Click on the temperature unit (°F/°C) to toggle between Fahrenheit and Celsius

3. **Refresh Weather**
   - Click the "Refresh Weather" button to update current weather data

4. **Weather News**
   - Scroll down to view latest weather-related news
   - Click on news headlines to read full articles

## API Integration

### WeatherAPI
- Used for weather data and city search
- Endpoints used:
  - `/current.json` - Current weather data
  - `/search.json` - City search autocomplete

### NewsAPI
- Used for weather-related news
- Endpoint used:
  - `/v2/everything` - News articles related to weather

## Deployment

### GitHub Pages
1. Go to repository settings
2. Navigate to "Pages" section
3. Select main branch as source
4. Save and wait for deployment

### Custom Domain
1. Update repository settings
2. Add your domain
3. Update DNS records
4. Wait for SSL certificate

## Troubleshooting

### Common Issues
1. **Weather Not Loading**
   - Check console for API errors
   - Verify API key is correct
   - Ensure internet connection is stable

2. **News Not Displaying**
   - Verify NewsAPI key
   - Check API call limits
   - Check browser console for CORS issues

3. **City Search Not Working**
   - Verify WeatherAPI key
   - Check network connection
   - Ensure proper API endpoint access

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Weather data provided by [WeatherAPI](https://www.weatherapi.com/)
- News data provided by [NewsAPI](https://newsapi.org/)
- Icons and design inspiration from various weather services

## Contact
For any queries or support, please open an issue in the GitHub repository.

---
Made with ❤️ by [Your Name]
