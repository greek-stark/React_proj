import React, { createContext, useContext, useState, useCallback } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useGeolocation } from '../hooks/useGeolocation';
import { useFavorites, useRecentSearches } from '../hooks/useLocalStorage';

const WeatherContext = createContext();

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const weather = useWeather();
  const geolocation = useGeolocation();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  const [selectedCity, setSelectedCity] = useState(null);
  const [unit, setUnit] = useState('C');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [theme, setTheme] = useState('light');

  const loadCityWeather = useCallback(async (city) => {
    try {
      await weather.fetchAllWeatherData(city);
      setSelectedCity(city);
      addRecentSearch(city);
    } catch (error) {
      console.error('Error loading city weather:', error);
      throw error;
    }
  }, [weather, addRecentSearch]);

  const loadLocationWeather = useCallback(async () => {
    try {
      const location = await geolocation.getCurrentLocation();
      await weather.fetchAllWeatherDataByCoordinates(location.latitude, location.longitude);
      setSelectedCity('Current Location');
    } catch (error) {
      console.error('Error loading location weather:', error);
      throw error;
    }
  }, [weather, geolocation]);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  const toggleTimeFormat = useCallback(() => {
    setTimeFormat((prev) => (prev === '12h' ? '24h' : '12h'));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const handleAddFavorite = useCallback((city) => {
    if (weather.currentWeather) {
      const favoriteData = {
        name: weather.currentWeather.name,
        country: weather.currentWeather.sys.country,
        temp: weather.currentWeather.main.temp,
        condition: weather.currentWeather.weather[0].description,
        icon: weather.currentWeather.weather[0].icon,
      };
      addFavorite(favoriteData);
    }
  }, [weather.currentWeather, addFavorite]);

  const handleRemoveFavorite = useCallback((cityName) => {
    removeFavorite(cityName);
  }, [removeFavorite]);

  const value = {
    weather,
    geolocation,
    selectedCity,
    unit,
    timeFormat,
    theme,
    favorites,
    recentSearches,
    loadCityWeather,
    loadLocationWeather,
    setSelectedCity,
    toggleUnit,
    toggleTimeFormat,
    toggleTheme,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
    isFavorite,
    clearRecentSearches,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};