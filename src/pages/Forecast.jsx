import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Ooty");
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // API CALL
  // ==============================
  const loadCityWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");

      // Current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error("City not found");
      }

      const weatherData = await weatherResponse.json();

      // 5 day / 3 hour forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );

      if (!forecastResponse.ok) {
        throw new Error("Forecast could not be loaded");
      }

      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      setHourlyForecast(forecastData);
      setSelectedCity(weatherData.name);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setWeather(null);
      setHourlyForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD DEFAULT CITY
  // ==============================
  useEffect(() => {
    loadCityWeather("Ooty");
  }, []);

  // ==============================
  // SEARCH
  // ==============================
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchCity.trim()) return;

    loadCityWeather(searchCity);
    setSearchCity("");
  };

  // ==============================
  // LOCATION API
  // ==============================
  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );

          if (!weatherResponse.ok) {
            throw new Error(
              "Unable to get weather for your location"
            );
          }

          const weatherData = await weatherResponse.json();

          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );

          if (!forecastResponse.ok) {
            throw new Error("Forecast could not be loaded");
          }

          const forecastData = await forecastResponse.json();

          setWeather(weatherData);
          setHourlyForecast(forecastData);
          setSelectedCity(weatherData.name);
        } catch (err) {
          setError(err.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied.");
        setLoading(false);
      }
    );
  };

  // ==============================
  // HELPERS
  // ==============================
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getRainProbability = (weatherId) => {
    if (weatherId >= 200 && weatherId < 600) return 80;
    if (weatherId >= 600 && weatherId < 700) return 70;
    if (weatherId >= 700 && weatherId < 800) return 20;
    if (weatherId === 800) return 5;
    return 20;
  };

  const getWeatherIcon = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // ==============================
  // 24 HOUR FORECAST
  // ==============================
  const get24HourForecast = () => {
    if (!hourlyForecast?.list) return [];

    return hourlyForecast.list.slice(0, 8);
  };

  // ==============================
  // TEMPERATURE CHART DATA
  // ==============================
  const getTemperatureChartData = () => {
    return get24HourForecast().map((hour) => ({
      time: formatTime(hour.dt),
      temperature: Math.round(hour.main.temp),
    }));
  };

  // ==============================
  // 5 DAY FORECAST
  // ==============================
  const getFiveDayForecast = () => {
    if (!hourlyForecast?.list) return [];

    const groupedDays = {};

    hourlyForecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);

      const dateKey = date.toISOString().split("T")[0];

      if (!groupedDays[dateKey]) {
        groupedDays[dateKey] = [];
      }

      groupedDays[dateKey].push(item);
    });

    return Object.values(groupedDays)
      .slice(0, 5)
      .map((day) => {
        const temperatures = day.map((item) => item.main.temp);

        // Find forecast closest to 12 PM
        const middayForecast =
          day.reduce((closest, current) => {
            const currentHour = new Date(
              current.dt * 1000
            ).getHours();

            const closestHour = new Date(
              closest.dt * 1000
            ).getHours();

            return Math.abs(currentHour - 12) <
              Math.abs(closestHour - 12)
              ? current
              : closest;
          }, day[0]);

        return {
          date: middayForecast.dt,
          min: Math.round(Math.min(...temperatures)),
          max: Math.round(Math.max(...temperatures)),
          icon: middayForecast.weather[0].icon,
          description: middayForecast.weather[0].description,
        };
      });
  };

  // ==============================
  // POPULAR CITIES
  // ==============================
  const popularCities = [
    "Thoothukudi",
    "Udangudi",
    "Kerala",
    "Coimbatore",
  ];

  // ==============================
  // LOADING
  // ==============================
  if (loading && !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          

          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading weather...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==============================
            SEARCH
        ============================== */}
        <div className="mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search city..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
            />

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
               Search
            </button>

            <button
              type="button"
              onClick={handleLocation}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
               My Location
            </button>
          </form>
        </div>

        {/* ==============================
            ERROR
        ============================== */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
             {error}
          </div>
        )}

        {/* ==============================
            CURRENT WEATHER
        ============================== */}
        {weather && (
          <div className="mb-8">

            <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 shadow-xl">

              <div className="flex flex-col md:flex-row justify-between items-center">

                <div>
                  <p className="text-blue-100">
                    Current Weather
                  </p>

                  <h1 className="text-4xl font-bold mt-2">
                    {weather.name}, {weather.sys.country}
                  </h1>

                  <p className="capitalize text-blue-100 mt-2">
                    {weather.weather[0].description}
                  </p>
                </div>

                <div className="flex items-center mt-6 md:mt-0">

                  <img
                    src={getWeatherIcon(
                      weather.weather[0].icon
                    )}
                    alt={weather.weather[0].description}
                    className="w-28 h-28"
                  />

                  <div>
                    <div className="text-6xl font-bold">
                      {Math.round(weather.main.temp)}°C
                    </div>

                    <p className="text-blue-100">
                      Feels like{" "}
                      {Math.round(weather.main.feels_like)}°C
                    </p>
                  </div>

                </div>
              </div>

              {/* WEATHER DETAILS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                <div className="bg-white/10 rounded-xl p-4">
                  
                  <p className="text-blue-100">Humidity</p>
                  <p className="text-xl font-bold">
                    {weather.main.humidity}%
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  
                  <p className="text-blue-100">Wind</p>
                  <p className="text-xl font-bold">
                    {weather.wind.speed} m/s
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  
                  <p className="text-blue-100">Pressure</p>
                  <p className="text-xl font-bold">
                    {weather.main.pressure} hPa
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  
                  <p className="text-blue-100">Visibility</p>
                  <p className="text-xl font-bold">
                    {(weather.visibility / 1000).toFixed(1)} km
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ==============================
            WEATHER HIGHLIGHTS
        ============================== */}
        {weather && (
          <div className="mb-8">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Weather Highlights
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

              <WeatherMetric
               
                label="Feels Like"
                value={`${Math.round(
                  weather.main.feels_like
                )}°C`}
              />

              <WeatherMetric
                
                label="Humidity"
                value={`${weather.main.humidity}%`}
              />

              <WeatherMetric
               
                label="Wind"
                value={`${weather.wind.speed} m/s`}
              />

              <WeatherMetric
                
                label="Pressure"
                value={`${weather.main.pressure} hPa`}
              />

              <WeatherMetric
                
                label="Visibility"
                value={`${(
                  weather.visibility / 1000
                ).toFixed(1)} km`}
              />

              <WeatherMetric
                
                label="Rain Chance"
                value={`${getRainProbability(
                  weather.weather[0].id
                )}%`}
              />

            </div>
          </div>
        )}

        {/* ==============================
            TEMPERATURE CHART
        ============================== */}
        {hourlyForecast && (
          <div className="mb-8">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Temperature — Next 24 Hours
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">

              <div className="w-full h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={getTemperatureChartData()}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      unit="°C"
                      tick={{ fontSize: 12 }}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `${value}°C`,
                        "Temperature",
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey="temperature"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 7 }}
                    />

                  </LineChart>
                </ResponsiveContainer>

              </div>
            </div>
          </div>
        )}

        {/* ==============================
            24 HOUR FORECAST
        ============================== */}
        {hourlyForecast && (
          <div className="mb-8">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              24 Hour Forecast
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4">

              {get24HourForecast().map((hour, index) => (

                <div
                  key={index}
                  className="flex-shrink-0 w-36 bg-white dark:bg-gray-800 rounded-xl p-4 shadow text-center"
                >

                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {formatTime(hour.dt)}
                  </p>

                  <img
                    src={getWeatherIcon(
                      hour.weather[0].icon
                    )}
                    alt={hour.weather[0].description}
                    className="w-16 h-16 mx-auto"
                  />

                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(hour.main.temp)}°C
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">
                    {hour.weather[0].description}
                  </p>

                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                     {hour.main.humidity}%
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                     {hour.wind.speed} m/s
                  </div>

                </div>

              ))}

            </div>
          </div>
        )}

        {/* ==============================
            5 DAY FORECAST
        ============================== */}
        {hourlyForecast && (
          <div className="mb-8">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5 Day Forecast
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

              {getFiveDayForecast().map((day, index) => (

                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow text-center"
                >

                  <p className="font-bold text-gray-900 dark:text-white">
                    {index === 0
                      ? "Today"
                      : formatDate(day.date)}
                  </p>

                  <img
                    src={getWeatherIcon(day.icon)}
                    alt={day.description}
                    className="w-20 h-20 mx-auto"
                  />

                  <p className="capitalize text-sm text-gray-500 dark:text-gray-400">
                    {day.description}
                  </p>

                  <div className="flex justify-center gap-3 mt-4">

                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {day.max}°
                    </span>

                    <span className="text-2xl text-gray-400">
                      {day.min}°
                    </span>

                  </div>

                  <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    High / Low
                  </div>

                </div>

              ))}

            </div>
          </div>
        )}

        {/* ==============================
            POPULAR CITIES
        ============================== */}
        <div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Cities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {popularCities.map((city) => (

              <button
                key={city}
                onClick={() => loadCityWeather(city)}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow hover:shadow-lg text-left transition"
              >

                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {city}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Click to view weather
                </p>

              </button>

            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

// ==============================
// WEATHER METRIC COMPONENT
// ==============================
const WeatherMetric = ({ icon, label, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">

      <div className="text-2xl mb-2">
        {icon}
      </div>

      <p className="text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="text-xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>

    </div>
  );
};

export default Home;

