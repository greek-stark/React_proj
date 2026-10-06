import React from 'react';
import { formatTemperature, getWeatherIcon } from '../utils/formatWeather';
import { useWeatherContext } from '../context/WeatherContext';

const CityCard = ({ city, onSelect, onRemove, isFavorite = false }) => {
  const { isFavorite: checkIsFavorite } = useWeatherContext();
  const isFav = checkIsFavorite(city.name);

  const handleSelect = () => {
    if (onSelect) onSelect(city.name);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove(city.name);
  };

  return (
    <div
      onClick={handleSelect}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{city.name}</h3>
          {city.country && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{city.country}</p>
          )}
        </div>
        {isFavorite && (
          <button
            onClick={handleRemove}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="text-lg">🗑️</span>
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{getWeatherIcon(city.icon || 800)}</span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTemperature(city.temp)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {city.condition || 'Clear'}
            </p>
          </div>
        </div>
        {isFav && (
          <span className="text-yellow-500">⭐</span>
        )}
      </div>
    </div>
  );
};

export default CityCard;