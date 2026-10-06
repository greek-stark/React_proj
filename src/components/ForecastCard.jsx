import React from 'react';
import { formatTemperature, getWeatherIcon } from '../utils/formatWeather';
import { formatDay, formatHour } from '../utils/formatDate';

const ForecastCard = ({ forecast, isHourly = false }) => {
  if (!forecast) return null;

  const time = isHourly ? formatHour(forecast.dt) : formatDay(forecast.dt);
  const icon = getWeatherIcon(forecast.weather[0].id);
  const temp = isHourly ? forecast.main.temp : forecast.temp;
  const condition = forecast.weather[0].description;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{time}</p>
        <div className="text-4xl mb-2">{icon}</div>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {formatTemperature(temp)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{condition}</p>
        {!isHourly && forecast.temp_min !== undefined && forecast.temp_max !== undefined && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatTemperature(forecast.temp_min)}</span>
            <span className="mx-1">/</span>
            <span>{formatTemperature(forecast.temp_max)}</span>
          </div>
        )}
        {forecast.pop !== undefined && (
          <p className="mt-1 text-xs text-blue-500">{Math.round(forecast.pop * 100)}% rain</p>
        )}
      </div>
    </div>
  );
};

export default ForecastCard;