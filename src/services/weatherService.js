const API_BASE_URL = ' https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric';
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

// --------------------------------------------------
// VALIDATE CITY
// --------------------------------------------------

const validateCity = (city) => {
  if (typeof city !== 'string' || !city.trim()) {
    throw new Error('Please enter a valid city name.');
  }

  return city.trim();
};

// --------------------------------------------------
// CURRENT WEATHER
// --------------------------------------------------

export const getCurrentWeather = async (city) => {
  const cleanCity = validateCity(city);

  const url =
    `${API_BASE_URL}/weather` +
    `?q=${encodeURIComponent(cleanCity)}` +
    `&appid=${API_KEY}` +
    `&units=metric`;

  console.log('Weather API URL:', url);
  console.log('Fetching weather for:', cleanCity);

  try {
    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'City not found. Please check the city name.'
        );
      }

      if (response.status === 401) {
        throw new Error(
          'Invalid API key. Please check your API key.'
        );
      }

      if (response.status === 429) {
        throw new Error(
          'Too many API requests. Please try again later.'
        );
      }

      throw new Error(
        data?.message || 'Failed to fetch weather data.'
      );
    }

    return data;
  } catch (error) {
    console.error('Weather Error:', error);
    throw error;
  }
};

// --------------------------------------------------
// FORECAST
// --------------------------------------------------

export const getForecast = async (city) => {
  const cleanCity = validateCity(city);

  const url =
    `${API_BASE_URL}/forecast` +
    `?q=${encodeURIComponent(cleanCity)}` +
    `&appid=${API_KEY}` +
    `&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'City not found. Please check the city name.'
        );
      }

      if (response.status === 401) {
        throw new Error(
          'Invalid API key. Please check your API key.'
        );
      }

      throw new Error(
        data?.message || 'Failed to fetch forecast data.'
      );
    }

    return data;
  } catch (error) {
    console.error('Forecast Error:', error);
    throw error;
  }
};

// --------------------------------------------------
// HOURLY FORECAST
// --------------------------------------------------

export const getHourlyForecast = async (city) => {
  const cleanCity = validateCity(city);

  const url =
    `${API_BASE_URL}/forecast` +
    `?q=${encodeURIComponent(cleanCity)}` +
    `&appid=${API_KEY}` +
    `&units=metric` +
    `&cnt=24`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || 'Failed to fetch hourly forecast.'
      );
    }

    return data;
  } catch (error) {
    console.error('Hourly Forecast Error:', error);
    throw error;
  }
};

// --------------------------------------------------
// DAILY FORECAST
// --------------------------------------------------

export const getDailyForecast = async (city) => {
  const data = await getForecast(city);

  if (!data?.list) {
    throw new Error('Invalid forecast response.');
  }

  return processDailyForecast(data.list);
};

// --------------------------------------------------
// PROCESS DAILY FORECAST
// --------------------------------------------------

const processDailyForecast = (forecastList) => {
  const dailyMap = new Map();

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date: item.dt,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        temp: item.main.temp,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        weather: item.weather[0],
        clouds: item.clouds.all,
        rain: item.rain?.['3h'] || 0,
        snow: item.snow?.['3h'] || 0,
        count: 1,
      });
    } else {
      const existing = dailyMap.get(date);

      existing.temp_min = Math.min(
        existing.temp_min,
        item.main.temp_min
      );

      existing.temp_max = Math.max(
        existing.temp_max,
        item.main.temp_max
      );

      existing.temp =
        (existing.temp * existing.count + item.main.temp) /
        (existing.count + 1);

      existing.humidity =
        (existing.humidity * existing.count + item.main.humidity) /
        (existing.count + 1);

      existing.wind_speed =
        (existing.wind_speed * existing.count + item.wind.speed) /
        (existing.count + 1);

      existing.clouds =
        (existing.clouds * existing.count + item.clouds.all) /
        (existing.count + 1);

      existing.rain += item.rain?.['3h'] || 0;
      existing.snow += item.snow?.['3h'] || 0;

      existing.count += 1;
    }
  });

  return Array.from(dailyMap.values())
    .slice(0, 7)
    .map((day) => ({
      date: day.date,
      temp_min: Math.round(day.temp_min),
      temp_max: Math.round(day.temp_max),
      temp: Math.round(day.temp),
      humidity: Math.round(day.humidity),
      wind_speed: Math.round(day.wind_speed),
      weather: day.weather,
      clouds: Math.round(day.clouds),
      rain: Math.round(day.rain),
      snow: Math.round(day.snow),
    }));
};

// --------------------------------------------------
// MULTIPLE CITIES
// --------------------------------------------------

export const getMultipleCitiesWeather = async (cities) => {
  if (!Array.isArray(cities)) {
    throw new Error('Cities must be an array.');
  }

  const validCities = cities
    .filter((city) => typeof city === 'string')
    .map((city) => city.trim())
    .filter(Boolean);

  if (validCities.length === 0) {
    throw new Error('No valid cities provided.');
  }

  const results = await Promise.allSettled(
    validCities.map((city) => getCurrentWeather(city))
  );

  const weather = [];
  const errors = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      weather.push(result.value);
    } else {
      errors.push({
        city: validCities[index],
        error: result.reason?.message || 'Unknown error',
      });
    }
  });

  console.log('Weather:', weather);
  console.log('Errors:', errors);

  return weather;
};

// --------------------------------------------------
// SEARCH CITIES
// --------------------------------------------------

export const searchCities = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  const url =
    `${API_BASE_URL}/find` +
    `?q=${encodeURIComponent(query.trim())}` +
    `&appid=${API_KEY}` +
    `&type=like` +
    `&sort=population` +
    `&cnt=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || 'Failed to search cities.'
      );
    }

    return data?.list || [];
  } catch (error) {
    console.error('City Search Error:', error);
    throw error;
  }
};

// --------------------------------------------------
// WEATHER ALERTS
// --------------------------------------------------

export const getWeatherAlerts = async (city) => {
  validateCity(city);

  // No coordinates and no /onecall API call.
  return [];
};

// --------------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------------

const weatherServiceDefault = {
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
  getDailyForecast,
  getMultipleCitiesWeather,
  searchCities,
  getWeatherAlerts,
};

export default weatherServiceDefault;

