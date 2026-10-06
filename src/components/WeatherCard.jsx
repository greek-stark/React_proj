import React from 'react';
import { formatTemperature, getWeatherIcon, formatHumidity, formatWindSpeed } from '../utils/formatWeather';
import { formatDate, formatSunTime } from '../utils/formatDate';

const WeatherCard = ({ weather, isNight = false }) => {
  if (!weather) return null;

  const {
    name,
    sys,
    main,
    weather: weatherData,
    wind,
    visibility,
  } = weather;

  const condition = weatherData[0];
  const icon = getWeatherIcon(condition.id, isNight);

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold">{name}</h2>
          <p className="text-blue-100">{sys?.country}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-100">{formatDate(new Date(), 'day')}</p>
          <p className="text-sm text-blue-100">{formatDate(new Date(), 'short')}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-6xl">{icon}</span>
          <div>
            <p className="text-5xl font-bold">{formatTemperature(main.temp)}</p>
            <p className="text-blue-100 capitalize">{condition.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-blue-100">Feels like</p>
          <p className="text-2xl font-semibold">{formatTemperature(main.feels_like)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-blue-100 text-sm">Humidity</p>
          <p className="text-xl font-semibold">{formatHumidity(main.humidity)}</p>
        </div>
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-blue-100 text-sm">Wind</p>
          <p className="text-xl font-semibold">{formatWindSpeed(wind.speed)}</p>
        </div>
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-blue-100 text-sm">Pressure</p>
          <p className="text-xl font-semibold">{main.pressure} hPa</p>
        </div>
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-blue-100 text-sm">Visibility</p>
          <p className="text-xl font-semibold">{(visibility / 1000).toFixed(1)} km</p>
        </div>
      </div>

      {weather.sys && (
        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-sm">
          <div>
            <p className="text-blue-100">Sunrise</p>
            <p className="font-semibold">{formatSunTime(weather.sys.sunrise)}</p>
          </div>
          <div>
            <p className="text-blue-100">Sunset</p>
            <p className="font-semibold">{formatSunTime(weather.sys.sunset)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;