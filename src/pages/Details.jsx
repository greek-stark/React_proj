import React, { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const Details = () => {
  const [cityA, setCityA] = useState("Thoothukudi");
  const [cityB, setCityB] = useState("Chennai");

  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  const [weatherA, setWeatherA] = useState(null);
  const [weatherB, setWeatherB] = useState(null);

  const [forecastA, setForecastA] = useState(null);
  const [forecastB, setForecastB] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // LOAD WEATHER
  // ======================================================
  const fetchWeather = async (cityName) => {
    const city = cityName.trim();

    if (!city) return null;

    if (!API_KEY) {
      throw new Error(
        "API key is missing. Add REACT_APP_WEATHER_API_KEY to your .env file."
      );
    }

    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${encodeURIComponent(city)}` +
      `&appid=${API_KEY}&units=metric`;

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?q=${encodeURIComponent(city)}` +
      `&appid=${API_KEY}&units=metric`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    if (!weatherResponse.ok) {
      throw new Error(weatherData.message || "Failed to load weather");
    }

    if (!forecastResponse.ok) {
      throw new Error(forecastData.message || "Failed to load forecast");
    }

    return {
      weather: weatherData,
      forecast: forecastData,
    };
  };

  // ======================================================
  // LOAD BOTH CITIES
  // ======================================================
  const loadComparison = async (
    firstCity = cityA,
    secondCity = cityB
  ) => {
    if (!firstCity.trim() || !secondCity.trim()) return;

    try {
      setLoading(true);
      setError("");

      const [first, second] = await Promise.all([
        fetchWeather(firstCity),
        fetchWeather(secondCity),
      ]);

      setWeatherA(first.weather);
      setForecastA(first.forecast);

      setWeatherB(second.weather);
      setForecastB(second.forecast);

      setCityA(first.weather.name);
      setCityB(second.weather.name);
    } catch (err) {
      console.error("Weather comparison error:", err);

      setError(err.message || "Unable to load weather comparison");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================
  useEffect(() => {
    loadComparison("Thoothukudi", "Chennai");
  }, []);

  // ======================================================
  // SEARCH CITY A
  // ======================================================
  const handleSearchA = (e) => {
    e.preventDefault();

    if (!searchA.trim()) return;

    loadComparison(searchA, cityB);
    setSearchA("");
  };

  // ======================================================
  // SEARCH CITY B
  // ======================================================
  const handleSearchB = (e) => {
    e.preventDefault();

    if (!searchB.trim()) return;

    loadComparison(cityA, searchB);
    setSearchB("");
  };

  // ======================================================
  // SWAP CITIES
  // ======================================================
  const swapCities = () => {
    const oldA = cityA;
    const oldB = cityB;

    setCityA(oldB);
    setCityB(oldA);

    loadComparison(oldB, oldA);
  };

  // ======================================================
  // HELPERS
  // ======================================================
  const temp = (weather) => {
    if (!weather?.main?.temp && weather?.main?.temp !== 0) {
      return "--";
    }

    return `${Math.round(weather.main.temp)}°`;
  };

  const tempC = (weather) => {
    if (!weather?.main?.temp && weather?.main?.temp !== 0) {
      return 0;
    }

    return Math.round(weather.main.temp);
  };

  const feelsLike = (weather) => {
    if (!weather?.main?.feels_like && weather?.main?.feels_like !== 0) {
      return "--";
    }

    return `${Math.round(weather.main.feels_like)}°C`;
  };

  const humidity = (weather) => {
    if (!weather?.main?.humidity && weather?.main?.humidity !== 0) {
      return "--";
    }

    return `${weather.main.humidity}%`;
  };

  const pressure = (weather) => {
    if (!weather?.main?.pressure) return "--";

    return `${weather.main.pressure} hPa`;
  };

  const visibility = (weather) => {
    if (!weather?.visibility && weather?.visibility !== 0) {
      return "--";
    }

    return `${(weather.visibility / 1000).toFixed(1)} km`;
  };

  const wind = (weather) => {
    if (!weather?.wind?.speed && weather?.wind?.speed !== 0) {
      return "--";
    }

    return `${weather.wind.speed} m/s`;
  };

  const cloudiness = (weather) => {
    if (!weather?.clouds?.all && weather?.clouds?.all !== 0) {
      return "--";
    }

    return `${weather.clouds.all}%`;
  };

  const rainChance = (forecast) => {
    const pop = forecast?.list?.[0]?.pop;

    if (typeof pop !== "number") return "0%";

    return `${Math.round(pop * 100)}%`;
  };

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

    return directions[Math.round(degree / 45) % 8];
  };

  const getDewPoint = (weather) => {
    if (!weather?.main) return "--";

    const temperature = weather.main.temp;
    const humidityValue = weather.main.humidity;

    const dewPoint =
      temperature - (100 - humidityValue) / 5;

    return `${Math.round(dewPoint)}°C`;
  };

  const getComfort = (weather) => {
    if (!weather?.main) return "--";

    const temperature = weather.main.temp;
    const humidityValue = weather.main.humidity;

    if (temperature < 5) return "Very Cold";
    if (temperature < 12) return "Cold";
    if (temperature < 18) return "Cool";

    if (
      temperature <= 26 &&
      humidityValue <= 70
    ) {
      return "Comfortable";
    }

    if (temperature <= 32) return "Warm";

    return "Hot";
  };

  const getSunTime = (timestamp) => {
    if (!timestamp) return "--";

    return new Date(timestamp * 1000).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ======================================================
  // COMPARE WINNER
  // ======================================================
  const getTemperatureWinner = () => {
    if (!weatherA || !weatherB) return null;

    if (tempC(weatherA) > tempC(weatherB)) return "A";
    if (tempC(weatherB) > tempC(weatherA)) return "B";

    return "tie";
  };

  const getHumidityWinner = () => {
    if (!weatherA || !weatherB) return null;

    if (
      weatherA.main.humidity <
      weatherB.main.humidity
    ) {
      return "A";
    }

    if (
      weatherB.main.humidity <
      weatherA.main.humidity
    ) {
      return "B";
    }

    return "tie";
  };

  // ======================================================
  // WEATHER SCORE
  // ======================================================
  const getWeatherScore = (weather, forecast) => {
    if (!weather) return 0;

    let score = 70;

    const temperature = weather.main.temp;
    const humidityValue = weather.main.humidity;
    const clouds = weather.clouds?.all || 0;
    const rain = forecast?.list?.[0]?.pop || 0;

    if (temperature >= 20 && temperature <= 30) {
      score += 10;
    }

    if (humidityValue >= 40 && humidityValue <= 70) {
      score += 8;
    }

    if (clouds < 40) {
      score += 7;
    }

    if (rain < 0.3) {
      score += 5;
    }

    return Math.min(score, 100);
  };

  // ======================================================
  // FORECAST
  // ======================================================
  const getDailyForecast = (forecast) => {
    if (!forecast?.list) return [];

    const grouped = {};

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(item);
    });

    return Object.entries(grouped)
      .slice(0, 5)
      .map(([date, items]) => {
        const temperatures = items.map(
          (item) => item.main.temp
        );

        const midday =
          items.find((item) => {
            const hour = new Date(
              item.dt * 1000
            ).getHours();

            return hour >= 11 && hour <= 14;
          }) || items[0];

        return {
          date,
          min: Math.min(...temperatures),
          max: Math.max(...temperatures),
          icon: midday.weather[0].icon,
          description: midday.weather[0].description,
          rain: Math.round(
            (midday.pop || 0) * 100
          ),
        };
      });
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (loading && !weatherA) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          

          <h2 className="text-2xl font-bold">
            Loading weather comparison...
          </h2>

          <p className="text-slate-400 mt-2">
            Getting the latest conditions
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==================================================
            HEADER
        ================================================== */}
        <header className="mb-8">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>
              <div className="flex items-center gap-3 mb-3">
                

                <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest">
                  Weather Compare
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                Compare Cities
              </h1>

              <p className="text-slate-400 mt-3 max-w-2xl">
                Compare temperature, humidity, wind,
                visibility, pressure and forecast
                conditions side-by-side.
              </p>
            </div>

            <button
              onClick={() =>
                loadComparison(cityA, cityB)
              }
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition font-semibold disabled:opacity-50"
            >
              {loading
                ? "Refreshing..."
                : "↻ Refresh Data"}
            </button>
          </div>
        </header>

        {/* ==================================================
            CITY SEARCH
        ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-8">

          {/* CITY A */}
          <form
            onSubmit={handleSearchA}
            className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-3"
          >
            <div className="flex gap-2">

              <input
                type="text"
                value={searchA}
                onChange={(e) =>
                  setSearchA(e.target.value)
                }
                placeholder={cityA}
                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-white placeholder:text-slate-500"
              />

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
              >
                Search
              </button>

            </div>
          </form>

          {/* VS */}
          <button
            onClick={swapCities}
            className="mx-auto w-12 h-12 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition font-black"
          >
            VS
          </button>

          {/* CITY B */}
          <form
            onSubmit={handleSearchB}
            className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-3"
          >
            <div className="flex gap-2">

              <input
                type="text"
                value={searchB}
                onChange={(e) =>
                  setSearchB(e.target.value)
                }
                placeholder={cityB}
                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-white placeholder:text-slate-500"
              />

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-semibold"
              >
                Search
              </button>

            </div>
          </form>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-4 text-red-300">
             {error}
          </div>
        )}

        {weatherA && weatherB && (
          <>
            {/* ==================================================
                COMPARISON HERO
            ================================================== */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

              <CityHero
                weather={weatherA}
                accent="blue"
                score={getWeatherScore(
                  weatherA,
                  forecastA
                )}
              />

              <CityHero
                weather={weatherB}
                accent="purple"
                score={getWeatherScore(
                  weatherB,
                  forecastB
                )}
              />

            </section>

            {/* ==================================================
                QUICK WINNER
            ================================================== */}
            <section className="mb-8">

              <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                      Quick Comparison
                    </p>

                    <h2 className="text-2xl font-bold mt-1">
                      Which city feels better?
                    </h2>
                  </div>

                  <div className="text-sm text-slate-400">
                    Based on current weather conditions
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <WinnerCard
                    title="Temperature"
                    
                    cityA={cityA}
                    cityB={cityB}
                    valueA={temp(weatherA)}
                    valueB={temp(weatherB)}
                    winner={getTemperatureWinner()}
                  />

                  <WinnerCard
                    title="Humidity"
                    
                    cityA={cityA}
                    cityB={cityB}
                    valueA={humidity(weatherA)}
                    valueB={humidity(weatherB)}
                    winner={getHumidityWinner()}
                  />

                  <WinnerCard
                    title="Rain Chance"
                   
                    cityA={cityA}
                    cityB={cityB}
                    valueA={rainChance(forecastA)}
                    valueB={rainChance(forecastB)}
                    winner={
                      Number(
                        rainChance(forecastA).replace(
                          "%",
                          ""
                        )
                      ) <
                      Number(
                        rainChance(forecastB).replace(
                          "%",
                          ""
                        )
                      )
                        ? "A"
                        : "B"
                    }
                  />

                </div>
              </div>
            </section>

            {/* ==================================================
                WEATHER HIGHLIGHTS
            ================================================== */}
            <section className="mb-8">

              <SectionHeading
                eyebrow="Detailed metrics"
                title="Weather Highlights"
                description="A side-by-side breakdown of current atmospheric conditions."
              />

              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">

                <ComparisonRow
                  
                  label="Temperature"
                  valueA={temp(weatherA)}
                  valueB={temp(weatherB)}
                  widthA={Math.min(
                    Math.max(
                      ((tempC(weatherA) + 10) / 50) *
                        100,
                      5
                    ),
                    100
                  )}
                  widthB={Math.min(
                    Math.max(
                      ((tempC(weatherB) + 10) / 50) *
                        100,
                      5
                    ),
                    100
                  )}
                />

                <ComparisonRow
                  
                  label="Feels Like"
                  valueA={feelsLike(weatherA)}
                  valueB={feelsLike(weatherB)}
                  widthA={50}
                  widthB={50}
                />

                <ComparisonRow
                  
                  label="Humidity"
                  valueA={humidity(weatherA)}
                  valueB={humidity(weatherB)}
                  widthA={weatherA.main.humidity}
                  widthB={weatherB.main.humidity}
                />

                <ComparisonRow
                  
                  label="Wind Speed"
                  valueA={wind(weatherA)}
                  valueB={wind(weatherB)}
                  widthA={Math.min(
                    weatherA.wind.speed * 10,
                    100
                  )}
                  widthB={Math.min(
                    weatherB.wind.speed * 10,
                    100
                  )}
                />

                <ComparisonRow
                 
                  label="Cloud Coverage"
                  valueA={cloudiness(weatherA)}
                  valueB={cloudiness(weatherB)}
                  widthA={weatherA.clouds?.all || 0}
                  widthB={weatherB.clouds?.all || 0}
                />

                <ComparisonRow
                  
                  label="Visibility"
                  valueA={visibility(weatherA)}
                  valueB={visibility(weatherB)}
                  widthA={Math.min(
                    (weatherA.visibility / 10000) *
                      100,
                    100
                  )}
                  widthB={Math.min(
                    (weatherB.visibility / 10000) *
                      100,
                    100
                  )}
                />

                <ComparisonRow
                  
                  label="Pressure"
                  valueA={pressure(weatherA)}
                  valueB={pressure(weatherB)}
                  widthA={Math.min(
                    (weatherA.main.pressure / 1100) *
                      100,
                    100
                  )}
                  widthB={Math.min(
                    (weatherB.main.pressure / 1100) *
                      100,
                    100
                  )}
                />

                <ComparisonRow
                  
                  label="Rain Probability"
                  valueA={rainChance(forecastA)}
                  valueB={rainChance(forecastB)}
                  widthA={
                    Number(
                      rainChance(forecastA).replace(
                        "%",
                        ""
                      )
                    )
                  }
                  widthB={
                    Number(
                      rainChance(forecastB).replace(
                        "%",
                        ""
                      )
                    )
                  }
                />

              </div>
            </section>

            {/* ==================================================
                FULL DETAILS
            ================================================== */}
            <section className="mb-8">

              <SectionHeading
                eyebrow="Atmosphere"
                title="Detailed Conditions"
                description="More information about the current environment."
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                <DetailsPanel
                  city={cityA}
                  weather={weatherA}
                  forecast={forecastA}
                />

                <DetailsPanel
                  city={cityB}
                  weather={weatherB}
                  forecast={forecastB}
                />

              </div>
            </section>

            {/* ==================================================
                5 DAY FORECAST
            ================================================== */}
            <section className="mb-8">

              <SectionHeading
                eyebrow="Coming days"
                title="5-Day Forecast Comparison"
                description="See how the weather changes over the next five days."
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                <ForecastPanel
                  city={cityA}
                  forecast={forecastA}
                />

                <ForecastPanel
                  city={cityB}
                  forecast={forecastB}
                />

              </div>
            </section>

            {/* ==================================================
                SUNRISE SUNSET
            ================================================== */}
            <section className="mb-8">

              <SectionHeading
                eyebrow="Daylight"
                title="Sunrise & Sunset"
                description="Compare daylight timing between both cities."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <SunPanel
                  city={cityA}
                  weather={weatherA}
                  getSunTime={getSunTime}
                />

                <SunPanel
                  city={cityB}
                  weather={weatherB}
                  getSunTime={getSunTime}
                />

              </div>
            </section>

            {/* ==================================================
                FINAL SUMMARY
            ================================================== */}
            <section className="mb-10">

              <div className="rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-blue-600/20 border border-white/10 backdrop-blur-xl p-7">

                <p className="text-sm uppercase tracking-widest font-bold text-blue-400">
                  Comparison Summary
                </p>

                <h2 className="text-3xl font-black mt-2">
                  {cityA} vs {cityB}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                  <SummaryCard
                    city={cityA}
                    score={getWeatherScore(
                      weatherA,
                      forecastA
                    )}
                    weather={weatherA}
                  />

                  <SummaryCard
                    city={cityB}
                    score={getWeatherScore(
                      weatherB,
                      forecastB
                    )}
                    weather={weatherB}
                  />

                </div>

              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
};

// ======================================================
// SECTION HEADING
// ======================================================
const SectionHeading = ({
  eyebrow,
  title,
  description,
}) => {
  return (
    <div className="mb-5">
      <p className="text-xs uppercase tracking-[0.2em] font-bold text-blue-400">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-black mt-1">
        {title}
      </h2>

      <p className="text-slate-400 mt-2">
        {description}
      </p>
    </div>
  );
};

// ======================================================
// CITY HERO
// ======================================================
const CityHero = ({
  weather,
  accent,
  score,
}) => {
  const isBlue = accent === "blue";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-7 border border-white/10 backdrop-blur-xl ${
        isBlue
          ? "bg-blue-600/10"
          : "bg-purple-600/10"
      }`}
    >

      <div
        className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl ${
          isBlue
            ? "bg-blue-500/20"
            : "bg-purple-500/20"
        }`}
      />

      <div className="relative">

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-slate-400 text-sm">
              Current Weather
            </p>

            <h2 className="text-3xl font-black mt-1">
              {weather.name}
              {weather.sys?.country
                ? `, ${weather.sys.country}`
                : ""}
            </h2>

            <p className="capitalize text-slate-400 mt-2">
              {weather.weather?.[0]?.description}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
            <p className="text-xs text-slate-400">
              Weather Score
            </p>

            <p className="text-2xl font-black mt-1">
              {score}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-5 mt-7">

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
            alt={weather.weather?.[0]?.description}
            className="w-24 h-24"
          />

          <div>
            <p className="text-6xl font-black">
              {Math.round(weather.main.temp)}°C
            </p>

            <p className="text-slate-400 mt-1">
              Feels like{" "}
              {Math.round(
                weather.main.feels_like
              )}
              °C
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

// ======================================================
// WINNER CARD
// ======================================================
const WinnerCard = ({
  title,
  icon,
  cityA,
  cityB,
  valueA,
  valueB,
  winner,
}) => {
  return (
    <div className="rounded-2xl bg-black/20 border border-white/5 p-5">

      <div className="flex items-center gap-2 mb-4">
        <span>{icon}</span>
        <span className="font-semibold">
          {title}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">

        <div
          className={`rounded-xl p-4 ${
            winner === "A"
              ? "bg-blue-500/20 border border-blue-400/30"
              : "bg-white/5"
          }`}
        >
          <p className="text-xs text-slate-400 truncate">
            {cityA}
          </p>

          <p className="text-xl font-bold mt-1">
            {valueA}
          </p>

          {winner === "A" && (
            <p className="text-xs text-blue-400 mt-2 font-semibold">
              Better
            </p>
          )}
        </div>

        <div
          className={`rounded-xl p-4 ${
            winner === "B"
              ? "bg-purple-500/20 border border-purple-400/30"
              : "bg-white/5"
          }`}
        >
          <p className="text-xs text-slate-400 truncate">
            {cityB}
          </p>

          <p className="text-xl font-bold mt-1">
            {valueB}
          </p>

          {winner === "B" && (
            <p className="text-xs text-purple-400 mt-2 font-semibold">
              Better
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

// ======================================================
// COMPARISON ROW
// ======================================================
const ComparisonRow = ({
  icon,
  label,
  valueA,
  valueB,
  widthA,
  widthB,
}) => {
  return (
    <div className="p-5 border-b border-white/10 last:border-b-0">

      <div className="grid grid-cols-[1fr_auto_1fr] gap-5 items-center">

        <div className="text-right">
          <p className="text-lg font-bold">
            {valueA}
          </p>

          <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full ml-auto transition-all"
              style={{
                width: `${Math.max(
                  5,
                  Math.min(widthA, 100)
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="text-center min-w-28">

          <div className="text-2xl">
            {icon}
          </div>

          <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">
            {label}
          </p>

        </div>

        <div>
          <p className="text-lg font-bold">
            {valueB}
          </p>

          <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{
                width: `${Math.max(
                  5,
                  Math.min(widthB, 100)
                )}%`,
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// ======================================================
// DETAILS PANEL
// ======================================================
const DetailsPanel = ({
  city,
  weather,
  forecast,
}) => {
  const metrics = [
    {
      
      label: "Feels Like",
      value: `${Math.round(
        weather.main.feels_like
      )}°C`,
    },
    {
      
      label: "Wind Direction",
      value: `${weather.wind?.deg ?? 0}°`,
    },
    {
      
      label: "Wind Gust",
      value: weather.wind?.gust
        ? `${weather.wind.gust} m/s`
        : "N/A",
    },
    {
      
      label: "Dew Point",
      value: getDewPointLocal(weather),
    },
    {
     
      label: "Pressure",
      value: `${weather.main.pressure} hPa`,
    },
    {
      
      label: "Visibility",
      value: `${(
        weather.visibility / 1000
      ).toFixed(1)} km`,
    },
    {
   
      label: "Cloud Coverage",
      value: `${weather.clouds?.all ?? 0}%`,
    },
    {
     
      label: "Rain Chance",
      value: `${Math.round(
        (forecast?.list?.[0]?.pop || 0) * 100
      )}%`,
    },
  ];

  return (
    <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-6">

      <div className="flex items-center justify-between mb-6">

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Current conditions
          </p>

          <h3 className="text-2xl font-black mt-1">
            {city}
          </h3>
        </div>

        

      </div>

      <div className="grid grid-cols-2 gap-3">

        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl bg-black/20 border border-white/5 p-4"
          >
            <div className="text-2xl">
              {metric.icon}
            </div>

            <p className="text-xs text-slate-500 mt-3">
              {metric.label}
            </p>

            <p className="text-lg font-bold mt-1">
              {metric.value}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

// ======================================================
// FORECAST PANEL
// ======================================================
const ForecastPanel = ({
  city,
  forecast,
}) => {
  const data = getDailyForecastLocal(forecast);

  return (
    <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-6">

      <div className="flex items-center justify-between mb-5">

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Forecast
          </p>

          <h3 className="text-2xl font-black mt-1">
            {city}
          </h3>
        </div>

        <span className="text-sm text-slate-500">
          5 Days
        </span>

      </div>

      <div className="space-y-3">

        {data.map((day) => (
          <div
            key={day.date}
            className="grid grid-cols-[70px_50px_1fr_auto] gap-3 items-center rounded-2xl bg-black/20 p-4"
          >

            <div>
              <p className="text-sm font-bold">
                {new Date(
                  `${day.date}T12:00:00`
                ).toLocaleDateString([], {
                  weekday: "short",
                })}
              </p>

              <p className="text-xs text-slate-500">
                {new Date(
                  `${day.date}T12:00:00`
                ).toLocaleDateString([], {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>

            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="w-10 h-10"
            />

            <div className="min-w-0">

              <p className="capitalize text-sm truncate">
                {day.description}
              </p>

              <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.max(
                      day.rain,
                      5
                    )}%`,
                  }}
                />
              </div>

            </div>

            <div className="text-right">

              <p className="font-bold">
                {Math.round(day.max)}°
              </p>

              <p className="text-sm text-slate-500">
                {Math.round(day.min)}°
              </p>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

// ======================================================
// SUN PANEL
// ======================================================
const SunPanel = ({
  city,
  weather,
  getSunTime,
}) => {
  const daylight =
    weather.sys?.sunset && weather.sys?.sunrise
      ? (
          (weather.sys.sunset -
            weather.sys.sunrise) /
          3600
        ).toFixed(1)
      : "--";

  return (
    <div className="rounded-3xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Daylight
          </p>

          <h3 className="text-2xl font-black mt-1">
            {city}
          </h3>
        </div>

        

      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs text-slate-500">
            Sunrise
          </p>

          <p className="font-bold mt-2">
            {getSunTime(weather.sys?.sunrise)}
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs text-slate-500">
            Sunset
          </p>

          <p className="font-bold mt-2">
            {getSunTime(weather.sys?.sunset)}
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs text-slate-500">
            Daylight
          </p>

          <p className="font-bold mt-2">
            {daylight}h
          </p>
        </div>

      </div>
    </div>
  );
};

// ======================================================
// SUMMARY CARD
// ======================================================
const SummaryCard = ({
  city,
  score,
  weather,
}) => {
  return (
    <div className="rounded-2xl bg-black/20 border border-white/5 p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-400">
            {city}
          </p>

          <p className="text-3xl font-black mt-1">
            {Math.round(weather.main.temp)}°C
          </p>
        </div>

        <div className="text-right">

          <p className="text-xs text-slate-500">
            Score
          </p>

          <p className="text-3xl font-black text-blue-400">
            {score}
          </p>

        </div>

      </div>

      <p className="text-sm text-slate-400 capitalize mt-4">
        {weather.weather?.[0]?.description}
      </p>
    </div>
  );
};

// ======================================================
// LOCAL HELPERS
// ======================================================
const getDewPointLocal = (weather) => {
  if (!weather?.main) return "--";

  const dewPoint =
    weather.main.temp -
    (100 - weather.main.humidity) / 5;

  return `${Math.round(dewPoint)}°C`;
};

const getDailyForecastLocal = (forecast) => {
  if (!forecast?.list) return [];

  const grouped = {};

  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(item);
  });

  return Object.entries(grouped)
    .slice(0, 5)
    .map(([date, items]) => {

      const temperatures = items.map(
        (item) => item.main.temp
      );

      const midday =
        items.find((item) => {
          const hour = new Date(
            item.dt * 1000
          ).getHours();

          return hour >= 11 && hour <= 14;
        }) || items[0];

      return {
        date,
        min: Math.min(...temperatures),
        max: Math.max(...temperatures),
        icon: midday.weather[0].icon,
        description:
          midday.weather[0].description,
        rain: Math.round(
          (midday.pop || 0) * 100
        ),
      };
    });
};

export default Details;

