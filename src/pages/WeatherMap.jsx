import React, { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const WeatherMap = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentForecast, setCurrentForecast] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [favoriteWeather, setFavoriteWeather] = useState({});

  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState({});
  const [error, setError] = useState("");

  // ======================================================
  // LOAD FAVORITES FROM LOCAL STORAGE
  // ======================================================

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("weatherFavorites");

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (err) {
      console.error("Favorites loading error:", err);
      setFavorites([]);
    }
  }, []);

  // ======================================================
  // SAVE FAVORITES
  // ======================================================

  useEffect(() => {
    localStorage.setItem(
      "weatherFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // ======================================================
  // API KEY CHECK
  // ======================================================

  const checkApiKey = () => {
    if (!API_KEY) {
      setError(
        "API key missing. Add REACT_APP_WEATHER_API_KEY to your .env file."
      );
      return false;
    }

    return true;
  };

  // ======================================================
  // LOAD CITY WEATHER
  // ======================================================

  const loadCityWeather = async (cityName) => {
    const city = cityName.trim();

    if (!city) return;

    if (!checkApiKey()) return;

    try {
      setLoading(true);
      setError("");

      const weatherUrl =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(city)}` +
        `&appid=${API_KEY}` +
        `&units=metric`;

      const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast` +
        `?q=${encodeURIComponent(city)}` +
        `&appid=${API_KEY}` +
        `&units=metric`;

      const [weatherResponse, forecastResponse] =
        await Promise.all([
          fetch(weatherUrl),
          fetch(forecastUrl),
        ]);

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(
          weatherData.message || "City not found"
        );
      }

      if (!forecastResponse.ok) {
        throw new Error(
          forecastData.message || "Forecast unavailable"
        );
      }

      setCurrentWeather(weatherData);
      setCurrentForecast(forecastData);
    } catch (err) {
      console.error("Weather API Error:", err);

      setError(
        err.message || "Unable to load weather information."
      );

      setCurrentWeather(null);
      setCurrentForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DEFAULT CITY
  // ======================================================

  useEffect(() => {
    loadCityWeather("Ooty");
  }, []);

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchCity.trim()) return;

    await loadCityWeather(searchCity);

    setSearchCity("");
  };

  // ======================================================
  // FAVORITE CHECK
  // ======================================================

  const isFavorite = (cityName) => {
    return favorites.some(
      (city) =>
        city.name?.toLowerCase() === cityName?.toLowerCase()
    );
  };

  // ======================================================
  // ADD FAVORITE
  // ======================================================

  const addFavorite = () => {
    if (!currentWeather) return;

    const cityName = currentWeather.name;

    if (isFavorite(cityName)) return;

    const favoriteCity = {
      name: currentWeather.name,
      country: currentWeather.sys?.country || "",
      temp: currentWeather.main?.temp,
      feelsLike: currentWeather.main?.feels_like,
      condition:
        currentWeather.weather?.[0]?.description || "",
      icon: currentWeather.weather?.[0]?.icon || "01d",
      addedAt: Date.now(),
    };

    setFavorites((prev) => [
      ...prev,
      favoriteCity,
    ]);
  };

  // ======================================================
  // REMOVE FAVORITE
  // ======================================================

  const removeFavorite = (cityName) => {
    setFavorites((prev) =>
      prev.filter(
        (city) =>
          city.name?.toLowerCase() !==
          cityName?.toLowerCase()
      )
    );

    setFavoriteWeather((prev) => {
      const updated = { ...prev };

      delete updated[cityName];

      return updated;
    });
  };

  // ======================================================
  // CLEAR ALL FAVORITES
  // ======================================================

  const clearAllFavorites = () => {
    setFavorites([]);
    setFavoriteWeather({});
  };

  // ======================================================
  // LOAD FAVORITE WEATHER
  // ======================================================

  const loadFavoriteWeather = async (favorite) => {
    const city = favorite.name;

    if (!checkApiKey()) return;

    try {
      setLoadingFavorite((prev) => ({
        ...prev,
        [city]: true,
      }));

      const weatherUrl =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(city)}` +
        `&appid=${API_KEY}` +
        `&units=metric`;

      const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast` +
        `?q=${encodeURIComponent(city)}` +
        `&appid=${API_KEY}` +
        `&units=metric`;

      const [weatherResponse, forecastResponse] =
        await Promise.all([
          fetch(weatherUrl),
          fetch(forecastUrl),
        ]);

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(
          weatherData.message || "Unable to load weather"
        );
      }

      setFavoriteWeather((prev) => ({
        ...prev,
        [city]: {
          weather: weatherData,
          forecast: forecastData,
        },
      }));
    } catch (err) {
      console.error(
        `Unable to load ${city}:`,
        err
      );

      setError(
        `${city}: ${
          err.message || "Unable to load weather"
        }`
      );
    } finally {
      setLoadingFavorite((prev) => ({
        ...prev,
        [city]: false,
      }));
    }
  };

  // ======================================================
  // LOAD ALL FAVORITES
  // ======================================================

  const refreshFavorites = async () => {
    for (const favorite of favorites) {
      await loadFavoriteWeather(favorite);
    }
  };

  // ======================================================
  // AUTO LOAD FAVORITE WEATHER
  // ======================================================

  useEffect(() => {
    if (favorites.length === 0) return;

    favorites.forEach((favorite) => {
      loadFavoriteWeather(favorite);
    });
  }, [favorites.length]);

  // ======================================================
  // FORMATTERS
  // ======================================================

  const temperature = (value) => {
    if (
      value === undefined ||
      value === null ||
      Number.isNaN(Number(value))
    ) {
      return "--";
    }

    return `${Math.round(value)}°`;
  };

  const temperatureC = (value) => {
    if (
      value === undefined ||
      value === null ||
      Number.isNaN(Number(value))
    ) {
      return "--";
    }

    return `${Math.round(value)}°C`;
  };

  const humidity = (value) => {
    if (
      value === undefined ||
      value === null
    ) {
      return "--";
    }

    return `${value}%`;
  };

  const windSpeed = (value) => {
    if (
      value === undefined ||
      value === null
    ) {
      return "--";
    }

    return `${Math.round(value)} m/s`;
  };

  // ======================================================
  // WIND DIRECTION
  // ======================================================

  const getWindDirection = (degree = 0) => {
    const directions = [
      "N",
      "NE",
      "E",
      "SE",
      "S",
      "SW",
      "W",
      "NW",
    ];

    return directions[
      Math.round(degree / 45) % 8
    ];
  };

  // ======================================================
  // RAIN PROBABILITY
  // ======================================================

  const getRainProbability = (forecast) => {
    const pop = forecast?.list?.[0]?.pop;

    if (typeof pop !== "number") {
      return "--";
    }

    return `${Math.round(pop * 100)}%`;
  };

  // ======================================================
  // VISIBILITY
  // ======================================================

  const getVisibility = (weather) => {
    const visibility = weather?.visibility;

    if (!visibility) return "--";

    return `${(visibility / 1000).toFixed(1)} km`;
  };

  // ======================================================
  // PRESSURE
  // ======================================================

  const getPressure = (weather) => {
    const pressure = weather?.main?.pressure;

    if (!pressure) return "--";

    return `${pressure} hPa`;
  };

  // ======================================================
  // UV PLACEHOLDER
  // ======================================================

  const getComfortLevel = (weather) => {
    const temp = weather?.main?.temp;

    if (temp === undefined) return "Unknown";

    if (temp < 10) return "Cold";

    if (temp < 18) return "Cool";

    if (temp < 28) return "Comfortable";

    if (temp < 35) return "Warm";

    return "Hot";
  };

  // ======================================================
  // WEATHER ICON
  // ======================================================

  const weatherIcon = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // ======================================================
  // LOADING SCREEN
  // ======================================================

  if (loading && !currentWeather) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-20 -left-20" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-0 right-0" />

        <div className="relative z-10 text-center">
          

          <p className="mt-5 text-white/70">
            Loading weather...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">

      {/* ==================================================
          BACKGROUND EFFECTS
      ================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] -top-32 -left-32" />

        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] top-1/3 -right-40" />

        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] bottom-0 left-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

          <div className="flex items-center gap-4">

            

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">
                Weather Dashboard
              </p>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                My Favorites
              </h1>

              <p className="text-white/45 text-sm mt-1">
                Keep your favorite cities close.
              </p>
            </div>

          </div>

          <button
            onClick={refreshFavorites}
            disabled={favorites.length === 0}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 backdrop-blur-xl transition disabled:opacity-40"
          >
             Refresh Favorites
          </button>

        </header>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <form
          onSubmit={handleSearch}
          className="mb-8 p-3 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-2xl"
        >

          <div className="flex flex-col sm:flex-row gap-3">

            <div className="flex-1 relative">

              

              <input
                type="text"
                value={searchCity}
                onChange={(e) =>
                  setSearchCity(e.target.value)
                }
                placeholder="Search for a city..."
                className="w-full h-14 pl-14 pr-5 rounded-2xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-blue-400/50 focus:bg-white/[0.06] transition"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-14 px-8 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 font-bold transition shadow-lg shadow-blue-500/20"
            >
              {loading ? "Searching..." : "Search City"}
            </button>

          </div>

        </form>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-400/20 text-red-200 backdrop-blur-xl">
             {error}

            <button
              onClick={() => setError("")}
              className="float-right text-white/50 hover:text-white"
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        )}

        {/* ==================================================
            CURRENT CITY
        ================================================== */}

        {currentWeather && (
          <section className="mb-12">

            <div className="flex items-center justify-between mb-4">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300/60">
                  Current City
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Weather Overview
                </h2>
              </div>

              <button
                onClick={addFavorite}
                className={`px-4 py-2 rounded-xl border backdrop-blur-xl transition ${
                  isFavorite(currentWeather.name)
                    ? "bg-yellow-400/15 border-yellow-300/30 text-yellow-300"
                    : "bg-white/[0.06] border-white/10 hover:bg-white/[0.1]"
                }`}
              >
                {isFavorite(currentWeather.name)
                  ? "★ Favorited"
                  : "☆ Add Favorite"}
              </button>

            </div>

            <div className="rounded-[2rem] p-6 sm:p-8 bg-white/[0.07] backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden relative">

              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

              <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-8">

                <div>

                  <div className="flex items-center gap-3 mb-5">

                    <span className="px-3 py-1 rounded-full bg-white/[0.07] border border-white/10 text-xs text-white/60">
                      LIVE WEATHER
                    </span>

                    {loading && (
                      <span className="text-xs text-blue-300 animate-pulse">
                        Updating...
                      </span>
                    )}

                  </div>

                  <h2 className="text-4xl sm:text-5xl font-black">
                    {currentWeather.name}
                  </h2>

                  <p className="text-white/45 mt-1">
                    {currentWeather.sys?.country}
                  </p>

                  <div className="flex items-center gap-4 mt-8">

                    <img
                      src={weatherIcon(
                        currentWeather.weather?.[0]?.icon
                      )}
                      alt={
                        currentWeather.weather?.[0]
                          ?.description
                      }
                      className="w-28 h-28"
                    />

                    <div>

                      <div className="text-6xl sm:text-7xl font-black tracking-tight">
                        {temperature(
                          currentWeather.main?.temp
                        )}
                      </div>

                      <p className="capitalize text-white/60 mt-1 text-lg">
                        {
                          currentWeather.weather?.[0]
                            ?.description
                        }
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-7">

                    <div className="px-4 py-3 rounded-2xl bg-black/20 border border-white/10">
                      <p className="text-xs text-white/40">
                        Feels like
                      </p>

                      <p className="font-bold mt-1">
                        {temperatureC(
                          currentWeather.main?.feels_like
                        )}
                      </p>
                    </div>

                    <div className="px-4 py-3 rounded-2xl bg-black/20 border border-white/10">
                      <p className="text-xs text-white/40">
                        Comfort
                      </p>

                      <p className="font-bold mt-1">
                        {getComfortLevel(currentWeather)}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <MetricCard
                  
                    label="Humidity"
                    value={humidity(
                      currentWeather.main?.humidity
                    )}
                  />

                  <MetricCard
                   
                    label="Wind"
                    value={windSpeed(
                      currentWeather.wind?.speed
                    )}
                  />

                  <MetricCard
                   
                    label="Rain Chance"
                    value={getRainProbability(
                      currentForecast
                    )}
                  />

                  <MetricCard
                   
                    label="Visibility"
                    value={getVisibility(
                      currentWeather
                    )}
                  />

                  <MetricCard
                   
                    label="Wind Direction"
                    value={`${getWindDirection(
                      currentWeather.wind?.deg
                    )} ${currentWeather.wind?.deg ?? 0}°`}
                  />

                  <MetricCard
                   
                    label="Pressure"
                    value={getPressure(
                      currentWeather
                    )}
                  />

                </div>

              </div>

            </div>

          </section>
        )}

        {/* ==================================================
            FAVORITES HEADER
        ================================================== */}

        <section>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-purple-300/60">
                Your Collection
              </p>

              <h2 className="text-3xl font-black mt-1">
                Favorite Cities
              </h2>

              <p className="text-white/40 text-sm mt-1">
                {favorites.length === 0
                  ? "No cities saved yet."
                  : `${favorites.length} ${
                      favorites.length === 1
                        ? "city"
                        : "cities"
                    } saved`}
              </p>
            </div>

            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="text-sm text-red-300/70 hover:text-red-300 transition"
              >
                Clear all favorites
              </button>
            )}

          </div>

          {/* ==================================================
              EMPTY FAVORITES
          ================================================== */}

          {favorites.length === 0 ? (
            <div className="rounded-[2rem] min-h-[320px] flex flex-col items-center justify-center text-center px-6 bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-2xl">

              

              <h3 className="text-2xl font-bold">
                Your favorites are empty
              </h3>

              <p className="text-white/40 max-w-md mt-2">
                Search for a city above and add it to your
                favorites. Your saved cities will appear here.
              </p>

              <div className="mt-6 px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-sm text-white/50">
                 Search a city → ☆ Add Favorite
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

              {favorites.map((favorite) => {

                const liveData =
                  favoriteWeather[favorite.name];

                const weather =
                  liveData?.weather;

                const forecast =
                  liveData?.forecast;

                const isLoading =
                  loadingFavorite[favorite.name];

                const displayTemp =
                  weather?.main?.temp ??
                  favorite.temp;

                const displayCondition =
                  weather?.weather?.[0]?.description ??
                  favorite.condition;

                const displayIcon =
                  weather?.weather?.[0]?.icon ??
                  favorite.icon;

                return (
                  <div
                    key={favorite.name}
                    className="group rounded-[2rem] p-5 bg-white/[0.06] hover:bg-white/[0.09] backdrop-blur-2xl border border-white/10 hover:border-white/20 shadow-xl transition-all duration-300"
                  >

                    {/* Card top */}

                    <div className="flex items-start justify-between">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
                            Saved City
                          </span>

                        </div>

                        <h3 className="text-2xl font-black mt-2">
                          {favorite.name}
                        </h3>

                        <p className="text-sm text-white/40">
                          {favorite.country}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          removeFavorite(
                            favorite.name
                          )
                        }
                        className="w-9 h-9 rounded-xl bg-red-400/5 hover:bg-red-400/15 border border-white/5 text-white/40 hover:text-red-300 transition"
                        aria-label={`Remove ${favorite.name} from favorites`}
                      >
                        ✕
                      </button>

                    </div>

                    {/* Weather */}

                    <div className="flex items-center justify-between mt-6">

                      <div className="flex items-center">

                        <img
                          src={weatherIcon(
                            displayIcon
                          )}
                          alt={displayCondition}
                          className="w-20 h-20"
                        />

                        <div>

                          <p className="text-4xl font-black">
                            {temperature(
                              displayTemp
                            )}
                          </p>

                          <p className="capitalize text-sm text-white/45 mt-1">
                            {displayCondition}
                          </p>

                        </div>

                      </div>

                      {isLoading && (
                        <div className="text-xs text-blue-300 animate-pulse">
                          Updating...
                        </div>
                      )}

                    </div>

                    {/* Metrics */}

                    {weather ? (
                      <div className="grid grid-cols-3 gap-2 mt-5">

                        <SmallMetric
                         
                          label="Humidity"
                          value={humidity(
                            weather.main?.humidity
                          )}
                        />

                        <SmallMetric
                         
                          label="Wind"
                          value={`${Math.round(
                            weather.wind?.speed || 0
                          )}`}
                        />

                        <SmallMetric
                       
                          label="Rain"
                          value={getRainProbability(
                            forecast
                          )}
                        />

                      </div>
                    ) : (
                      <div className="mt-5 p-3 rounded-2xl bg-black/20 border border-white/5 text-xs text-white/30">
                        Weather details will appear after
                        refresh.
                      </div>
                    )}

                    {/* Bottom */}

                    <div className="flex gap-2 mt-5">

                      <button
                        onClick={() =>
                          loadCityWeather(
                            favorite.name
                          )
                        }
                        className="flex-1 py-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/20 text-blue-200 text-sm font-semibold transition"
                      >
                        View Weather
                      </button>

                      <button
                        onClick={() =>
                          loadFavoriteWeather(
                            favorite
                          )
                        }
                        disabled={isLoading}
                        className="px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-sm transition disabled:opacity-40"
                        aria-label={`Refresh ${favorite.name}`}
                      >
                        ↻
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="mt-14 pt-6 border-t border-white/5 text-center">

          <p className="text-xs text-white/25">
            Weather data powered by OpenWeather
          </p>

          <p className="text-[11px] text-white/15 mt-1">
            Favorites are stored locally in your browser.
          </p>

        </footer>

      </div>
    </div>
  );
};

// ======================================================
// LARGE METRIC CARD
// ======================================================

const MetricCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl p-4 bg-black/20 hover:bg-black/30 border border-white/10 transition">

      <div className="text-2xl mb-3">
        {icon}
      </div>

      <p className="text-xs text-white/35">
        {label}
      </p>

      <p className="text-lg font-bold mt-1">
        {value}
      </p>

    </div>
  );
};

// ======================================================
// SMALL FAVORITE METRIC
// ======================================================

const SmallMetric = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl p-3 bg-black/20 border border-white/5">

      <div className="text-sm">
        {icon}
      </div>

      <p className="text-[10px] text-white/30 mt-1">
        {label}
      </p>

      <p className="text-sm font-bold mt-0.5">
        {value}
      </p>

    </div>
  );
};

export default WeatherMap;

