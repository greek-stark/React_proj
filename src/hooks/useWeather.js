import { useState, useCallback } from 'react';
import weatherService from '../services/weatherService';

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentWeather = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getCurrentWeather(city);
      setCurrentWeather(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoordinates = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getWeatherByCoordinates(lat, lon);
      setCurrentWeather(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHourlyForecast = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getHourlyForecast(city);
      setHourlyForecast(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailyForecast = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getDailyForecast(city);
      setDailyForecast(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllWeatherData = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [current, hourly, daily] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getHourlyForecast(city),
        weatherService.getDailyForecast(city),
      ]);
      
      setCurrentWeather(current);
      setHourlyForecast(hourly);
      setDailyForecast(daily);
      
      return { current, hourly, daily };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllWeatherDataByCoordinates = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [current, hourly, daily] = await Promise.all([
        weatherService.getWeatherByCoordinates(lat, lon),
        weatherService.getForecastByCoordinates(lat, lon),
        weatherService.getForecastByCoordinates(lat, lon),
      ]);
      
      setCurrentWeather(current);
      setHourlyForecast(hourly);
      setDailyForecast(daily);
      
      return { current, hourly, daily };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearWeatherData = useCallback(() => {
    setCurrentWeather(null);
    setHourlyForecast(null);
    setDailyForecast(null);
    setError(null);
  }, []);

  return {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    loading,
    error,
    fetchCurrentWeather,
    fetchWeatherByCoordinates,
    fetchHourlyForecast,
    fetchDailyForecast,
    fetchAllWeatherData,
    fetchAllWeatherDataByCoordinates,
    clearWeatherData,
  };
};