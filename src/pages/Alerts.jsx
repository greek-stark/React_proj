import React, { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

// ======================================================
// SAFETY DATA
// ======================================================

const safetyRecommendations = [
  {
    condition: "Severe Weather",
    icon: "⛈️",
    recommendations: [
      "Stay indoors and away from windows",
      "Have emergency supplies ready",
      "Monitor local weather information",
      "Avoid unnecessary travel",
    ],
  },
  {
    condition: "Heat",
    icon: "🔥",
    recommendations: [
      "Drink plenty of water",
      "Avoid prolonged sun exposure",
      "Wear light, loose clothing",
      "Take breaks in cool locations",
    ],
  },
  {
    condition: "Cold",
    icon: "🥶",
    recommendations: [
      "Dress in warm layers",
      "Protect exposed skin",
      "Limit prolonged outdoor exposure",
      "Keep warm emergency supplies available",
    ],
  },
  {
    condition: "Wind",
    icon: "💨",
    recommendations: [
      "Secure loose outdoor objects",
      "Use caution when driving",
      "Avoid exposed areas",
      "Watch for falling branches or debris",
    ],
  },
  {
    condition: "Rain",
    icon: "🌧️",
    recommendations: [
      "Carry an umbrella or rain jacket",
      "Drive slowly and carefully",
      "Avoid flooded areas",
      "Monitor changing road conditions",
    ],
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

const Alerts = () => {
  const [city, setCity] = useState("Ooty");
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // GLASS STYLE
  // ======================================================

  const glassCard =
    "bg-white/[0.055] backdrop-blur-2xl border border-white/10 shadow-2xl";

  // ======================================================
  // WEATHER API
  // ======================================================

  const loadWeather = async (cityName) => {
    const cityValue = cityName.trim();

    if (!cityValue) return;

    if (!API_KEY) {
      setError(
        "API key is missing. Add REACT_APP_WEATHER_API_KEY to your .env file."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(cityValue)}` +
        `&appid=${API_KEY}` +
        `&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to fetch weather data."
        );
      }

      setWeather(data);
      setCity(data.name);
      setAlerts(generateWeatherAlerts(data));
    } catch (err) {
      console.error("Weather API Error:", err);

      setWeather(null);
      setAlerts([]);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadWeather("Ooty");
  }, []);

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    loadWeather(search);
    setSearch("");
  };

  // ======================================================
  // GENERATE WEATHER ALERTS
  // ======================================================

  const generateWeatherAlerts = (data) => {
    if (!data) return [];

    const generated = [];

    const condition = data.weather?.[0];
    const temp = data.main?.temp;
    const wind = data.wind?.speed;
    const visibility = data.visibility;
    const humidity = data.main?.humidity;

    const now = Math.floor(Date.now() / 1000);

    // THUNDERSTORM
    if (condition?.id >= 200 && condition?.id < 300) {
      generated.push({
        id: "thunderstorm",
        event: "Severe Weather Warning",
        description:
          "Thunderstorm conditions are currently reported. Stay indoors and avoid exposed areas.",
        severity: "Critical",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "⛈️",
      });
    }

    // RAIN
    if (condition?.id >= 500 && condition?.id < 600) {
      generated.push({
        id: "rain",
        event: "Rain Advisory",
        description:
          "Rain is currently reported. Carry rain protection and use caution while traveling.",
        severity: "Moderate",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "🌧️",
      });
    }

    // SNOW
    if (condition?.id >= 600 && condition?.id < 700) {
      generated.push({
        id: "snow",
        event: "Snow Advisory",
        description:
          "Snow conditions are currently reported. Travel carefully and dress warmly.",
        severity: "High",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "❄️",
      });
    }

    // EXTREME HEAT
    if (temp > 40) {
      generated.push({
        id: "extreme-heat",
        event: "Extreme Heat Warning",
        description:
          "Extremely high temperatures are present. Stay hydrated and avoid prolonged sun exposure.",
        severity: "Critical",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "🔥",
      });
    } else if (temp > 35) {
      generated.push({
        id: "heat",
        event: "Heat Advisory",
        description:
          "High temperatures are present. Stay hydrated and avoid prolonged exposure to direct sunlight.",
        severity: "High",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "🌡️",
      });
    }

    // COLD
    if (temp < 0) {
      generated.push({
        id: "freeze",
        event: "Freeze Warning",
        description:
          "Freezing temperatures are present. Protect sensitive plants, pipes, and exposed equipment.",
        severity: "High",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "🥶",
      });
    } else if (temp < 5) {
      generated.push({
        id: "cold",
        event: "Cold Weather Advisory",
        description:
          "Cold temperatures are present. Dress warmly and limit prolonged exposure.",
        severity: "Moderate",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "🧣",
      });
    }

    // WIND
    if (wind >= 20) {
      generated.push({
        id: "extreme-wind",
        event: "High Wind Warning",
        description:
          "Very strong winds are being reported. Secure loose outdoor objects and avoid unnecessary travel.",
        severity: "Critical",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "🌪️",
      });
    } else if (wind >= 15) {
      generated.push({
        id: "wind",
        event: "Wind Advisory",
        description:
          "Strong winds are being reported. Secure outdoor objects and use caution while traveling.",
        severity: "High",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "💨",
      });
    }

    // VISIBILITY
    if (visibility < 1000) {
      generated.push({
        id: "fog",
        event: "Dense Fog Advisory",
        description:
          "Very low visibility is being reported. Use headlights and drive with extreme caution.",
        severity: "High",
        start: now,
        end: now + 43200,
        sender_name: "Weather Service",
        icon: "🌫️",
      });
    } else if (visibility < 3000) {
      generated.push({
        id: "low-visibility",
        event: "Low Visibility Advisory",
        description:
          "Visibility is reduced. Exercise additional caution while driving.",
        severity: "Moderate",
        start: now,
        end: now + 43200,
        sender_name: "Weather Service",
        icon: "🌫️",
      });
    }

    // HUMIDITY
    if (humidity >= 90 && temp >= 25) {
      generated.push({
        id: "humidity",
        event: "High Humidity Advisory",
        description:
          "High humidity may increase discomfort and heat stress. Stay hydrated and take breaks in cool areas.",
        severity: "Low",
        start: now,
        end: now + 86400,
        sender_name: "Weather Service",
        icon: "💧",
      });
    }

    return generated;
  };

  // ======================================================
  // FILTERS
  // ======================================================

  const severeAlerts = alerts.filter(
    (alert) =>
      alert.severity === "Critical" ||
      alert.severity === "High"
  );

  const rainAlerts = alerts.filter((alert) =>
    alert.event.toLowerCase().includes("rain")
  );

  const temperatureAlerts = alerts.filter((alert) =>
    ["heat", "cold", "freeze"].some((word) =>
      alert.event.toLowerCase().includes(word)
    )
  );

  const windAlerts = alerts.filter((alert) =>
    ["wind", "storm"].some((word) =>
      alert.event.toLowerCase().includes(word)
    )
  );

  const countSeverity = (severity) => {
    return alerts.filter(
      (alert) => alert.severity === severity
    ).length;
  };

  // ======================================================
  // LOADING SCREEN
  // ======================================================

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-[#050816] text-white grid grid-cols-3">

        <div className="col-span-3 min-h-screen flex items-center justify-center">

          <div className="text-center">

            <div className="w-24 h-24 mx-auto rounded-3xl bg-white/[0.07] border border-white/10 grid place-items-center text-5xl animate-pulse">
              🌤️
            </div>

            <h2 className="text-xl font-bold mt-6">
              Loading weather alerts
            </h2>

            <p className="text-white/35 text-sm mt-2">
              Getting the latest conditions...
            </p>

          </div>

        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">

      {/* BACKGROUND GLOWS */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[140px] -top-48 -left-40" />

        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[140px] top-1/3 -right-48" />

        <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] bottom-[-200px] left-1/3" />

      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="grid grid-cols-3 gap-5 mb-8">

          <div className="col-span-3 lg:col-span-2 flex items-center gap-4">

            

            <div>

              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-300/60 font-bold">
                Weather Intelligence
              </p>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Weather Alerts
              </h1>

              <p className="text-white/35 text-sm mt-1">
                Real-time weather warnings for {city}
              </p>

            </div>
          </div>

          <div className="col-span-3 lg:col-span-1 grid place-items-center rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl p-4">

            <span className="text-[10px] uppercase tracking-widest text-white/30">
              Status
            </span>

            <span className="text-sm font-bold text-emerald-300 mt-1">
              ● Live
            </span>

          </div>

        </header>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <form
          onSubmit={handleSearch}
          className={`${glassCard} rounded-3xl p-3 mb-8`}
        >

          <div className="grid grid-cols-3 gap-3">

            <div className="col-span-3 lg:col-span-2 relative">

              

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city..."
                className="
                  w-full h-14
                  pl-14 pr-5
                  rounded-2xl
                  bg-black/20
                  border border-white/10
                  text-white
                  placeholder:text-white/25
                  outline-none
                  focus:border-blue-400/40
                  focus:bg-white/[0.06]
                  transition
                "
              />

            </div>

            <div className="col-span-3 lg:col-span-1 grid grid-cols-3 gap-3">

              <button
                type="submit"
                disabled={loading}
                className="
                  col-span-2
                  h-14
                  rounded-2xl
                  bg-blue-500/90
                  hover:bg-blue-400
                  disabled:opacity-50
                  font-bold
                  shadow-lg
                  shadow-blue-500/20
                  transition
                "
              >
                {loading ? "Loading..." : "Search"}
              </button>

              <button
                type="button"
                onClick={() => loadWeather(city)}
                disabled={loading}
                className="
                  col-span-1
                  h-14
                  rounded-2xl
                  bg-white/[0.06]
                  hover:bg-white/[0.11]
                  border border-white/10
                  disabled:opacity-50
                  font-semibold
                  transition
                "
              >
                ↻
              </button>

            </div>

          </div>
        </form>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-8 grid grid-cols-3 gap-4 rounded-3xl p-5 bg-red-500/10 border border-red-400/20">

            <div className="col-span-3 lg:col-span-2 flex items-center gap-4">

              <div className="w-11 h-11 shrink-0 rounded-2xl bg-red-500/15 grid place-items-center">
                X
              </div>

              <div>

                <p className="font-semibold text-red-200">
                  Weather request failed
                </p>

                <p className="text-sm text-red-200/60 mt-1">
                  {error}
                </p>

              </div>

            </div>

            <div className="col-span-3 lg:col-span-1 flex lg:justify-end">

              <button
                onClick={() => setError("")}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/50"
              >
                ✕
              </button>

            </div>

          </div>
        )}

        {/* ==================================================
            CURRENT WEATHER
        ================================================== */}

        {weather && (
          <section className="mb-10">

            <div className={`${glassCard} rounded-[2rem] p-6 sm:p-8`}>

              <div className="grid grid-cols-3 gap-8">

                {/* WEATHER INFORMATION */}

                <div className="col-span-3 lg:col-span-2">

                  <div className="flex items-center gap-3 mb-5">

                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                    <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-300/70 font-bold">
                      Current Conditions
                    </span>

                  </div>

                  <div className="grid grid-cols-3 gap-6 items-center">

                    <div className="col-span-3 sm:col-span-1">

                      <h2 className="text-4xl sm:text-5xl font-black">
                        {weather.name}
                      </h2>

                      <p className="text-white/35 mt-1">
                        {weather.sys?.country}
                      </p>

                      <p className="capitalize text-white/55 mt-4 text-lg">
                        {weather.weather?.[0]?.description}
                      </p>

                    </div>

                    <div className="col-span-3 sm:col-span-2 flex items-center justify-center gap-3">

                      <img
                        src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                        alt={weather.weather?.[0]?.description}
                        className="w-24 h-24 sm:w-28 sm:h-28"
                      />

                      <div>

                        <div className="text-6xl sm:text-7xl font-black">
                          {Math.round(weather.main.temp)}°
                        </div>

                        <p className="text-xs text-white/35">
                          Feels like{" "}
                          {Math.round(weather.main.feels_like)}°C
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* METRICS */}

                <div className="col-span-3 lg:col-span-1 grid grid-cols-3 gap-3">

                  <WeatherMetric
                    icon="💧"
                    label="Humidity"
                    value={`${weather.main?.humidity ?? "--"}%`}
                  />

                  <WeatherMetric
                    icon="💨"
                    label="Wind"
                    value={`${weather.wind?.speed ?? "--"} m/s`}
                  />

                  <WeatherMetric
                    icon="👁️"
                    label="Visibility"
                    value={
                      weather.visibility
                        ? `${(weather.visibility / 1000).toFixed(1)} km`
                        : "--"
                    }
                  />

                  <div className="col-span-3">

                    <WeatherMetric
                      icon="🎚️"
                      label="Pressure"
                      value={`${weather.main?.pressure ?? "--"} hPa`}
                    />

                  </div>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* ==================================================
            ALERT OVERVIEW
        ================================================== */}

        <section className="mb-10">

          <div className="grid grid-cols-3 gap-5 mb-5">

            <div className="col-span-3 lg:col-span-2">

              <p className="text-[10px] uppercase tracking-[0.25em] text-purple-300/60 font-bold">
                Live Monitoring
              </p>

              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                Alert Overview
              </h2>

              <p className="text-sm text-white/35 mt-1">
                Weather conditions detected for {city}
              </p>

            </div>

            <div className="col-span-3 lg:col-span-1 flex lg:justify-end">

              <div className="px-4 py-3 h-fit rounded-2xl bg-white/[0.05] border border-white/10 text-sm text-white/50">
                {alerts.length} total
              </div>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-4">

            <SummaryCard
              icon="🔴"
              label="Critical"
              value={countSeverity("Critical")}
            />

            <SummaryCard
              icon="🟠"
              label="High"
              value={countSeverity("High")}
            />

            <SummaryCard
              icon="🟡"
              label="Moderate"
              value={countSeverity("Moderate")}
            />

            <SummaryCard
              icon="🔵"
              label="Low"
              value={countSeverity("Low")}
            />

          </div>

        </section>

        {/* ==================================================
            ALERT SECTIONS
        ================================================== */}

        <AlertSection
          title="Severe Weather"
          icon="⚠️"
          data={severeAlerts}
          emptyTitle="No severe weather alerts"
          emptyDescription="No critical or high severity alerts are currently detected."
        />

        <AlertSection
          title="Rain Alerts"
          icon="🌧️"
          data={rainAlerts}
          emptyTitle="No rain alerts"
          emptyDescription="No active rain advisories are currently detected."
        />

        <AlertSection
          title="Temperature Alerts"
          icon="🌡️"
          data={temperatureAlerts}
          emptyTitle="No temperature alerts"
          emptyDescription="No extreme temperature alerts are currently detected."
        />

        <AlertSection
          title="Wind Alerts"
          icon="💨"
          data={windAlerts}
          emptyTitle="No wind alerts"
          emptyDescription="No strong wind alerts are currently detected."
        />

        {/* ==================================================
            SAFETY RECOMMENDATIONS
        ================================================== */}

        <section className="mb-10">

          <div className="grid grid-cols-3 gap-4 items-center mb-5">

            <div className="col-span-1">

              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-300/10 grid place-items-center text-2xl">
                🛡️
              </div>

            </div>

            <div className="col-span-2">

              <h2 className="text-2xl sm:text-3xl font-black">
                Safety Recommendations
              </h2>

              <p className="text-sm text-white/35 mt-1">
                Simple actions based on different weather conditions
              </p>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-4">

            {safetyRecommendations.map((item) => (
              <SafetyCard
                key={item.condition}
                item={item}
              />
            ))}

          </div>

        </section>

        {/* ==================================================
            FINAL STATUS
        ================================================== */}

        <section
          className={`${glassCard} rounded-[2rem] p-6 sm:p-8 mb-8`}
        >

          <div className="grid grid-cols-3 gap-6 items-center">

            <div className="col-span-3 lg:col-span-2">

              <p className="text-[10px] uppercase tracking-[0.25em] text-blue-300/60 font-bold">
                Weather Safety Status
              </p>

              <h2 className="text-2xl font-black mt-2">

                {alerts.length === 0
                  ? "Conditions look clear"
                  : `${alerts.length} weather condition${
                      alerts.length === 1 ? "" : "s"
                    } detected`}

              </h2>

              <p className="text-sm text-white/35 mt-2 max-w-2xl">

                {alerts.length === 0
                  ? "There are currently no automatically detected weather advisories for this location."
                  : "Review the alerts above and follow the recommended safety guidance for the current conditions."}

              </p>

            </div>

            <div className="col-span-3 lg:col-span-1 flex lg:justify-end">

              <div
                className={`
                  px-6 py-4 rounded-2xl border
                  ${
                    alerts.length === 0
                      ? "bg-emerald-400/10 border-emerald-300/10 text-emerald-300"
                      : "bg-orange-400/10 border-orange-300/10 text-orange-300"
                  }
                `}
              >

                <div className="text-xs uppercase tracking-widest opacity-60">
                  Status
                </div>

                <div className="font-black text-lg mt-1">
                  {alerts.length === 0
                    ? "CLEAR"
                    : "ATTENTION"}
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="grid grid-cols-3 border-t border-white/5 py-5">

          <div className="col-span-3 text-center">

            <p className="text-xs text-white/20">
              Weather data powered by OpenWeather
            </p>

            <p className="text-[11px] text-white/10 mt-1">
              Alerts are automatically generated from current weather conditions.
            </p>

          </div>

        </footer>

      </main>
    </div>
  );
};

// ======================================================
// ALERT SECTION
// ======================================================

const AlertSection = ({
  title,
  icon,
  data,
  emptyTitle,
  emptyDescription,
}) => {
  return (
    <section className="mb-8">

      <div className="grid grid-cols-3 gap-4 items-center mb-4">

        <div className="col-span-3 lg:col-span-2 flex items-center gap-3">

          <div className="w-11 h-11 shrink-0 rounded-2xl bg-white/[0.07] border border-white/10 grid place-items-center text-xl">
            {icon}
          </div>

          <div>

            <h2 className="text-xl sm:text-2xl font-black">
              {title}
            </h2>

            <p className="text-xs text-white/30 mt-1">
              {data.length} active alert
              {data.length !== 1 ? "s" : ""}
            </p>

          </div>

        </div>

        <div className="col-span-3 lg:col-span-1 flex lg:justify-end">

          <div className="grid place-items-center min-w-10 h-10 px-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white/60">
            {data.length}
          </div>

        </div>

      </div>

      {data.length > 0 ? (

        <div className="grid grid-cols-3 gap-4">

          {data.map((alert) => (
            <div
              key={alert.id}
              className="col-span-3 lg:col-span-1"
            >
              <AlertCard alert={alert} />
            </div>
          ))}

        </div>

      ) : (

        <div className="bg-white/[0.055] backdrop-blur-2xl border border-emerald-400/10 rounded-3xl p-7">

          <div className="grid grid-cols-3 gap-4 items-center">

            <div className="col-span-1">

              <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-300/10 grid place-items-center text-2xl">
                ✓
              </div>

            </div>

            <div className="col-span-2">

              <h3 className="font-bold text-white">
                {emptyTitle}
              </h3>

              <p className="text-sm text-white/35 mt-1">
                {emptyDescription}
              </p>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};

// ======================================================
// ALERT CARD
// ======================================================

const AlertCard = ({ alert }) => {

  const styles = {
    Critical: {
      border: "border-red-400/30",
      bg: "bg-red-500/15",
      text: "text-red-300",
      badge: "bg-red-500/20 text-red-200",
    },

    High: {
      border: "border-orange-400/30",
      bg: "bg-orange-500/15",
      text: "text-orange-300",
      badge: "bg-orange-500/20 text-orange-200",
    },

    Moderate: {
      border: "border-yellow-400/30",
      bg: "bg-yellow-500/15",
      text: "text-yellow-300",
      badge: "bg-yellow-500/20 text-yellow-200",
    },

    Low: {
      border: "border-blue-400/30",
      bg: "bg-blue-500/15",
      text: "text-blue-300",
      badge: "bg-blue-500/20 text-blue-200",
    },
  };

  const style = styles[alert.severity] || styles.Low;

  return (
    <article
      className={`
        h-full
        rounded-3xl
        p-5
        bg-white/[0.055]
        backdrop-blur-2xl
        border
        ${style.border}
        shadow-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-white/[0.08]
      `}
    >

      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-1">

          <div
            className={`
              w-14 h-14
              rounded-2xl
              ${style.bg}
              border border-white/10
              grid place-items-center
              text-2xl
            `}
          >
            {alert.icon}
          </div>

        </div>

        <div className="col-span-2">

          <div className="grid grid-cols-3 gap-2">

            <h3
              className={`
                col-span-2
                text-lg
                font-bold
                ${style.text}
              `}
            >
              {alert.event}
            </h3>

            <span
              className={`
                col-span-1
                justify-self-end
                h-fit
                px-2
                py-1
                rounded-full
                border
                border-white/10
                text-[10px]
                uppercase
                tracking-wider
                ${style.badge}
              `}
            >
              {alert.severity}
            </span>

          </div>

          <p className="text-sm leading-6 text-white/55 mt-2">
            {alert.description}
          </p>

        </div>

        <div className="col-span-3 grid grid-cols-3 gap-3 border-t border-white/5 pt-4">

          <div className="col-span-1 text-white/30 text-xs">

            Source

            <span className="block text-white/60 mt-1">
              {alert.sender_name}
            </span>

          </div>

          <div className="col-span-2 text-white/30 text-xs">

            Valid

            <span className="block text-white/60 mt-1">
              Next 24 hours
            </span>

          </div>

        </div>

      </div>

    </article>
  );
};

// ======================================================
// WEATHER METRIC
// ======================================================

const WeatherMetric = ({ icon, label, value }) => {
  return (
    <div className="col-span-1 rounded-2xl p-4 bg-black/20 border border-white/10 hover:bg-white/[0.06] transition">

      <div className="text-xl mb-3">
        {icon}
      </div>

      <p className="text-[11px] uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className="text-lg font-black mt-1">
        {value}
      </p>

    </div>
  );
};

// ======================================================
// SUMMARY CARD
// ======================================================

const SummaryCard = ({ icon, label, value }) => {
  return (
    <div
      className="
        col-span-3
        sm:col-span-1
        rounded-3xl
        p-5
        bg-white/[0.055]
        backdrop-blur-2xl
        border border-white/10
        shadow-xl
        hover:bg-white/[0.08]
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      <div className="grid grid-cols-3 gap-3 items-center">

        <div className="col-span-1">

          <div className="w-11 h-11 rounded-2xl bg-black/20 border border-white/10 grid place-items-center text-lg">
            {icon}
          </div>

        </div>

        <div className="col-span-2">

          <p className="text-xs text-white/30">
            {label}
          </p>

          <p className="text-3xl font-black mt-1">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
};

// ======================================================
// SAFETY CARD
// ======================================================

const SafetyCard = ({ item }) => {
  return (
    <div
      className="
        col-span-3
        md:col-span-1
        rounded-3xl
        p-5
        bg-white/[0.055]
        backdrop-blur-2xl
        border border-white/10
        hover:bg-white/[0.08]
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      <div className="grid grid-cols-3 gap-3 items-center mb-5">

        <div className="col-span-1">

          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 grid place-items-center text-2xl">
            {item.icon}
          </div>

        </div>

        <div className="col-span-2">

          <h3 className="font-bold text-lg">
            {item.condition}
          </h3>

        </div>

      </div>

      <ul className="grid grid-cols-3 gap-3">

        {item.recommendations.map((recommendation) => (
          <li
            key={recommendation}
            className="col-span-3 grid grid-cols-3 gap-2 text-sm text-white/45"
          >

            <span className="col-span-1 text-emerald-400">
              ✓
            </span>

            <span className="col-span-2">
              {recommendation}
            </span>

          </li>
        ))}

      </ul>

    </div>
  );
};

export default Alerts;