# SkyCast – Real-Time Weather Forecast Dashboard

A professional, production-ready weather application built with React, featuring real-time weather data, weather recommendations, and comprehensive weather analytics.

![SkyCast](https://img.shields.io/badge/React-18.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Core Functionality
- **Real-Time Weather Data**: Live weather conditions from OpenWeatherMap API
- **Geolocation Support**: Automatic weather detection using browser geolocation
- **City Search**: Intelligent search with autocomplete and recent searches
- **7-Day Forecast**: Extended weather predictions with detailed metrics
- **Hourly Forecast**: 24-hour weather breakdown
- **Weather Alerts**: Severe weather warnings and safety recommendations
- **Weather Assistant**: Weather insights and personalized recommendations
- **Location Comparison**: Compare weather between multiple cities
- **Favorites System**: Save and quickly access favorite cities
- **Responsive Design**: Beautiful UI optimized for all devices

### Advanced Features
- **Weather Recommendations**: Get clothing, activity, and travel advice
- **Weather Data Visualization**: Interactive charts and graphs
- **Dark/Light Theme**: Toggle between visual themes
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Offline Support**: LocalStorage for favorites and recent searches
- **Loading States**: Professional skeleton loaders
- **Error Handling**: Graceful error recovery and user feedback

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skycast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your API keys:
   ```env
   REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key_here
   REACT_APP_AI_API_KEY=your_openai_api_key_here
   REACT_APP_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
   REACT_APP_AI_API_BASE_URL=https://api.openai.com/v1
   ```

4. **Get API Key**
   
   - **OpenWeatherMap API**: Sign up at [openweathermap.org](https://openweathermap.org/api) to get your free API key

5. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
skycast/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIChat.jsx
│   │   ├── CityCard.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ForecastCard.jsx
│   │   ├── LocationButton.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── WeatherAlert.jsx
│   │   ├── WeatherCard.jsx
│   │   └── WeatherMetric.jsx
│   ├── context/             # React Context for state management
│   │   └── WeatherContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useDebounce.js
│   │   ├── useGeolocation.js
│   │   ├── useLocalStorage.js
│   │   └── useWeather.js
│   ├── pages/               # Page components
│   │   ├── AIAssistant.jsx
│   │   ├── Alerts.jsx
│   │   ├── Details.jsx
│   │   ├── Forecast.jsx
│   │   ├── Home.jsx
│   │   └── WeatherMap.jsx
│   ├── services/            # API service layer
│   │   ├── aiService.js
│   │   └── weatherService.js
│   ├── utils/               # Utility functions
│   │   ├── formatDate.js
│   │   ├── formatWeather.js
│   │   └── weatherHelpers.js
│   ├── App.js               # Main app component with routing
│   ├── index.css            # Global styles with Tailwind
│   └── index.js             # Entry point
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

## 🎯 Pages Overview

### 1. Home (`/`)
- Current weather display with detailed metrics
- Weather highlights (temperature, humidity, wind, pressure, visibility)
- Hourly forecast carousel
- Popular cities quick access
- Search and location detection

### 2. Forecast (`/forecast`)
- Today's weather summary
- 24-hour detailed forecast
- 7-day extended forecast
- Temperature trend visualization
- AI-powered recommendations

### 3. Details (`/details`)
- Comprehensive weather metrics
- Temperature analysis (feels like, min/max, dew point)
- Wind details (speed, direction, gusts)
- Humidity and pressure information
- Visibility and UV index
- Sunrise/sunset times

### 4. Weather Map (`/map`)
- Current location weather
- Saved/favorite locations
- Multi-city weather comparison
- Popular city comparisons
- Detailed comparison tables

### 5. Alerts (`/alerts`)
- Severe weather alerts
- Rain and flood warnings
- Temperature extremes
- Wind advisories
- Safety recommendations

### 6. AI Assistant (`/ai-assistant`)
- AI-powered weather summary
- Interactive chat interface
- Clothing recommendations
- Activity suggestions
- Travel advice
- Quick question buttons

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **Recharts**: Data visualization library
- **OpenWeatherMap API**: Weather data provider
- **OpenAI API**: AI-powered recommendations

## 📝 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (one-way operation)
npm run eject
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Environment Variables
Required environment variables:
- `REACT_APP_WEATHER_API_KEY`: OpenWeatherMap API key
- `REACT_APP_AI_API_KEY`: OpenAI API key (optional)

## 🎨 Customization

### Adding New Weather Metrics
1. Add formatting function in `src/utils/formatWeather.js`
2. Update service layer if needed
3. Add UI component in `src/components/`
4. Integrate into relevant pages

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.js`
3. Add navigation link in `src/components/Navbar.jsx`

### Modifying AI Prompts
Edit AI service prompts in `src/services/aiService.js` to customize AI responses.

## 🐛 Troubleshooting

### API Key Issues
- Ensure your `.env` file is in the root directory
- Verify API keys are correct and active
- Restart the development server after adding keys

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm start -- --reset-cache`

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that `index.css` includes Tailwind directives
- Verify `tailwind.config.js` content paths

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- API keys are never exposed in client-side code
- Implement rate limiting for production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- AI powered by [OpenAI](https://openai.com/)
- Icons and weather visualizations
- Built with modern web technologies

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ using React and modern web technologies**