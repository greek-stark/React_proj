import React, { useState } from "react";

function Home() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    const searchWeather = async () => {
        if (!city.trim()) {
            setError("Please enter a city name.");
            return;
        }

        setLoading(true);
        setError("");
        setWeather(null);

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error("City not found");
            }

            const data = await response.json();

            setWeather(data);
        } catch (error) {
            console.error(error);
            setError(
                "Unable to find the city. Please check the city name."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            searchWeather();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "--";

        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* =====================================================
                SECTION 1 - HERO
            ====================================================== */}

            <section
                className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(2,6,23,.78),rgba(15,23,42,.92)),url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=2000&q=80')",
                }}
            >
                <div className="absolute inset-0 bg-blue-950/20" />

                <div className="relative z-10 w-full max-w-6xl text-center">

                    <p className="text-blue-400 font-semibold tracking-[0.3em] uppercase mb-5">
                        Weather Intelligence
                    </p>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-7">
                        Know Your Weather.
                        <br />

                        <span className="text-blue-400">
                            Plan Your Day.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl mb-10">
                        Real-time weather information with clear,
                        accurate and beautifully presented weather insights.
                    </p>

                    {/* Search */}

                    <div className="max-w-3xl mx-auto">

                        <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 shadow-2xl">

                            <input
                                type="text"
                                placeholder="Enter city name..."
                                value={city}
                                onChange={(event) =>
                                    setCity(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                className="flex-1 px-6 py-4 rounded-xl bg-white text-slate-900 outline-none text-lg"
                            />

                            <button
                                onClick={searchWeather}
                                disabled={loading}
                                className="px-9 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all duration-300 font-semibold text-lg disabled:opacity-50"
                            >
                                {loading ? "Searching..." : "Search Weather"}
                            </button>

                        </div>

                        {error && (
                            <p className="text-red-400 mt-5">
                                {error}
                            </p>
                        )}

                    </div>
                </div>
            </section>


            {/* =====================================================
                SECTION 2 - CURRENT WEATHER
            ====================================================== */}

            <section className="py-24 px-6 bg-slate-900">

                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-14">

                        <p className="text-blue-400 uppercase tracking-widest font-semibold mb-3">
                            Current Conditions
                        </p>

                        <h2 className="text-4xl md:text-5xl font-bold">
                            Your Weather Right Now
                        </h2>

                    </div>

                    {weather ? (
                        <div className="grid lg:grid-cols-2 gap-8">

                            {/* Weather Image */}

                            <div
                                className="min-h-[420px] rounded-3xl overflow-hidden bg-cover bg-center relative"
                                style={{
                                    backgroundImage:
                                        "url('https://i.pinimg.com/originals/8b/b9/aa/8bb9aae8a3ef9f680c6e862e90eca047.jpg')",
                                }}
                            >
                                <div className="absolute inset-0 bg-slate-950/45" />

                                <div className="relative h-full flex flex-col justify-end p-8">

                                    <p className="text-slate-300 mb-2">
                                        Current Weather
                                    </p>

                                    <h3 className="text-4xl font-bold">
                                        {weather.name}
                                    </h3>

                                    <p className="text-slate-300 mt-2">
                                        {weather.sys.country}
                                    </p>

                                </div>
                            </div>


                            {/* Temperature */}

                            <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 flex flex-col justify-center">

                                <p className="text-slate-400">
                                    Temperature
                                </p>

                                <div className="text-7xl md:text-8xl font-bold mt-4">
                                    {Math.round(weather.main.temp)}°C
                                </div>

                                <p className="text-blue-400 text-xl capitalize mt-5">
                                    {weather.weather[0].description}
                                </p>

                                <div className="grid grid-cols-2 gap-5 mt-10">

                                    <div className="bg-slate-900 rounded-2xl p-5">
                                        <p className="text-slate-400">
                                            Feels Like
                                        </p>

                                        <p className="text-2xl font-bold mt-2">
                                            {Math.round(
                                                weather.main.feels_like
                                            )}°C
                                        </p>
                                    </div>

                                    <div className="bg-slate-900 rounded-2xl p-5">
                                        <p className="text-slate-400">
                                            Humidity
                                        </p>

                                        <p className="text-2xl font-bold mt-2">
                                            {weather.main.humidity}%
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800 rounded-3xl border border-slate-700">
                            <p className="text-slate-400 text-lg">
                                Search for a city to view current weather.
                            </p>
                        </div>
                    )}

                </div>

            </section>


            {/* =====================================================
                SECTION 3 - WEATHER HIGHLIGHTS
            ====================================================== */}

            <section className="py-24 px-6 bg-slate-950">

                <div className="max-w-6xl mx-auto">

                    <div className="mb-14">

                        <p className="text-blue-400 uppercase tracking-widest font-semibold mb-3">
                            Weather Highlights
                        </p>

                        <h2 className="text-4xl md:text-5xl font-bold">
                            Everything At A Glance
                        </h2>

                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {[
                            {
                                title: "Temperature",
                                value: weather
                                    ? `${Math.round(weather.main.temp)}°C`
                                    : "--",
                                image:
                                    "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&w=800&q=80",
                            },
                            {
                                title: "Humidity",
                                value: weather
                                    ? `${weather.main.humidity}%`
                                    : "--",
                                image:
                                    "https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=800&q=80",
                            },
                            {
                                title: "Wind Speed",
                                value: weather
                                    ? `${weather.wind.speed} m/s`
                                    : "--",
                                image:
                                    "https://images.unsplash.com/photo-1505672678657-cc7037095e60?auto=format&fit=crop&w=800&q=80",
                            },
                            {
                                title: "Pressure",
                                value: weather
                                    ? `${weather.main.pressure} hPa`
                                    : "--",
                                image:
                                    "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="group relative h-72 rounded-3xl overflow-hidden"
                            >

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />

                                <div className="absolute inset-0 bg-slate-950/65" />

                                <div className="relative z-10 h-full flex flex-col justify-end p-7">

                                    <p className="text-slate-300">
                                        {item.title}
                                    </p>

                                    <h3 className="text-3xl font-bold mt-2">
                                        {item.value}
                                    </h3>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 4 - ATMOSPHERE
            ====================================================== */}

            <section className="py-24 px-6 bg-slate-900">

                <div className="max-w-6xl mx-auto">

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <div>

                            <p className="text-blue-400 uppercase tracking-widest font-semibold mb-4">
                                Atmospheric Details
                            </p>

                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Understand The Conditions
                            </h2>

                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Get essential atmospheric information to
                                understand what is happening around you.
                            </p>

                            <div className="space-y-5">

                                <div className="flex justify-between bg-slate-800 p-5 rounded-2xl">
                                    <span className="text-slate-400">
                                        Visibility
                                    </span>

                                    <span className="font-semibold">
                                        {weather
                                            ? `${(
                                                  weather.visibility / 1000
                                              ).toFixed(1)} km`
                                            : "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between bg-slate-800 p-5 rounded-2xl">
                                    <span className="text-slate-400">
                                        Pressure
                                    </span>

                                    <span className="font-semibold">
                                        {weather
                                            ? `${weather.main.pressure} hPa`
                                            : "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between bg-slate-800 p-5 rounded-2xl">
                                    <span className="text-slate-400">
                                        Wind Direction
                                    </span>

                                    <span className="font-semibold">
                                        {weather
                                            ? `${weather.wind.deg}°`
                                            : "--"}
                                    </span>
                                </div>

                            </div>

                        </div>


                        <div className="rounded-3xl overflow-hidden h-[500px]">

                            <img
                                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                                alt="Atmospheric landscape"
                                className="w-full h-full object-cover hover:scale-105 transition duration-700"
                            />

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 5 - SUNRISE / SUNSET
            ====================================================== */}

            <section className="py-24 px-6 bg-slate-950">

                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-14">

                        <p className="text-blue-400 uppercase tracking-widest font-semibold mb-3">
                            Daylight
                        </p>

                        <h2 className="text-4xl md:text-5xl font-bold">
                            Follow The Sun
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div
                            className="relative h-80 rounded-3xl overflow-hidden bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80')",
                            }}
                        >

                            <div className="absolute inset-0 bg-slate-950/50" />

                            <div className="relative p-8 h-full flex flex-col justify-end">

                                <p className="text-slate-300">
                                    Sunrise
                                </p>

                                <h3 className="text-4xl font-bold mt-2">
                                    {weather
                                        ? formatTime(weather.sys.sunrise)
                                        : "--"}
                                </h3>

                            </div>

                        </div>


                        <div
                            className="relative h-80 rounded-3xl overflow-hidden bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80')",
                            }}
                        >

                            <div className="absolute inset-0 bg-slate-950/50" />

                            <div className="relative p-8 h-full flex flex-col justify-end">

                                <p className="text-slate-300">
                                    Sunset
                                </p>

                                <h3 className="text-4xl font-bold mt-2">
                                    {weather
                                        ? formatTime(weather.sys.sunset)
                                        : "--"}
                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 6 - WEATHER EXPERIENCE
            ====================================================== */}

            <section className="py-24 px-6 bg-blue-950">

                <div className="max-w-6xl mx-auto">

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <div className="rounded-3xl overflow-hidden h-[450px]">

                            <img
                                src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=1200&q=80"
                                alt="Cloudy weather"
                                className="w-full h-full object-cover"
                            />

                        </div>

                        <div>

                            <p className="text-blue-300 uppercase tracking-widest font-semibold mb-4">
                                Weather Experience
                            </p>

                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Simple Information.
                                <br />
                                Powerful Decisions.
                            </h2>

                            <p className="text-blue-100/70 text-lg leading-relaxed mb-8">
                                Whether you are planning a trip, heading to
                                work, exercising outdoors or simply checking
                                the conditions, our weather dashboard gives
                                you the information you need.
                            </p>

                            <button
                                onClick={() =>
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    })
                                }
                                className="px-7 py-4 rounded-xl bg-white text-slate-950 font-semibold hover:bg-blue-100 transition"
                            >
                                Search Another City
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 7 - POPULAR DESTINATIONS
            ====================================================== */}

            <section className="py-24 px-6 bg-slate-900">

                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-14">

                        <p className="text-blue-400 uppercase tracking-widest font-semibold mb-3">
                            Explore
                        </p>

                        <h2 className="text-4xl md:text-5xl font-bold">
                            Popular Destinations
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-3 gap-7">

                        {[
                            {
                                city: "Ooty",
                                image:
                                    "https://s3.india.com/wp-content/uploads/2024/07/Historical-Places-To-Visit-In-Ooty.jpg##image/jpg",
                            },
                            {
                                city: "Coimbatore",
                                image:
                                    "https://assets.simplotel.com/simplotel/image/upload/w_5000,h_3333/x_0,y_260,w_5000,h_2813,r_0,c_crop,q_80,fl_progressive/w_825,f_auto,c_fit/black-thunder---water-theme-park/remi-clinton-E5egsk4eUQ0-unsplash_842455d4",
                            },
                            {
                                city: "Keraka",
                                image:
                                    "https://tse4.mm.bing.net/th/id/OIP.ZPSeZg2ci-ZCNeXHBU09fAHaEf?r=0&pid=Api&P=0&h=180",
                            },
                        ].map((item) => (
                            <button
                                key={item.city}
                                onClick={() => {
                                    setCity(item.city);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                                className="group relative h-80 rounded-3xl overflow-hidden text-left"
                            >

                                <img
                                    src={item.image}
                                    alt={item.city}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                                <div className="relative z-10 h-full flex items-end p-7">

                                    <h3 className="text-3xl font-bold">
                                        {item.city}
                                    </h3>

                                </div>

                            </button>
                        ))}

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 8 - WEATHER GUIDE
            ====================================================== */}

            <section className="py-24 px-6 bg-slate-950">

                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-14">

                        <p className="text-blue-400 uppercase tracking-widest font-semibold mb-3">
                            Weather Guide
                        </p>

                        <h2 className="text-4xl md:text-5xl font-bold">
                            Read The Weather Better
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-3 gap-7">

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

                            <img
                                src="https://images.nationalgeographic.org/image/upload/v1638892307/EducationHub/photos/through-the-clouds.jpg"
                                alt="Clouds"
                                className="w-full h-48 object-cover rounded-2xl mb-6"
                            />

                            <h3 className="text-2xl font-bold mb-3">
                                Cloud Coverage
                            </h3>

                            <p className="text-slate-400 leading-relaxed">
                                Clouds can influence temperature, visibility
                                and the overall feel of the day.
                            </p>

                        </div>


                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

                            <img
                                src="https://images.unsplash.com/photo-1433863448220-78aaa064ff47?auto=format&fit=crop&w=700&q=80"
                                alt="Rain"
                                className="w-full h-48 object-cover rounded-2xl mb-6"
                            />

                            <h3 className="text-2xl font-bold mb-3">
                                Rain Conditions
                            </h3>

                            <p className="text-slate-400 leading-relaxed">
                                Humidity and atmospheric pressure can help
                                explain changing weather conditions.
                            </p>

                        </div>


                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

                            <img
                                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80"
                                alt="Outdoor landscape"
                                className="w-full h-48 object-cover rounded-2xl mb-6"
                            />

                            <h3 className="text-2xl font-bold mb-3">
                                Outdoor Planning
                            </h3>

                            <p className="text-slate-400 leading-relaxed">
                                Use temperature, wind and visibility to make
                                better decisions before heading outside.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 9 - CALL TO ACTION
            ====================================================== */}

            <section className="py-28 px-6 bg-gradient-to-r from-blue-700 to-blue-950">

                <div className="max-w-4xl mx-auto text-center">

                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Check The Weather Before You Go.
                    </h2>

                    <p className="text-blue-100 text-lg md:text-xl mb-9">
                        Search any city and get real-time weather conditions
                        in seconds.
                    </p>

                    <button
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        className="px-9 py-4 rounded-xl bg-white text-slate-950 font-semibold text-lg hover:bg-blue-50 transition"
                    >
                        Check Weather
                    </button>

                </div>

            </section>


            {/* =====================================================
                SECTION 10 - FOOTER
            ====================================================== */}

            <footer className="bg-slate-950 border-t border-slate-800 px-6 py-14">

                <div className="max-w-6xl mx-auto">

                    <div className="grid md:grid-cols-3 gap-10">

                        <div>

                            <h3 className="text-2xl font-bold mb-4">
                                Weather<span className="text-blue-400">IQ</span>
                            </h3>

                            <p className="text-slate-400 leading-relaxed">
                                Modern weather intelligence designed to help
                                you understand current conditions anywhere.
                            </p>

                        </div>


                        <div>

                            <h4 className="font-semibold mb-4">
                                Weather Data
                            </h4>

                            <p className="text-slate-400">
                                Temperature
                            </p>

                            <p className="text-slate-400 mt-2">
                                Humidity
                            </p>

                            <p className="text-slate-400 mt-2">
                                Wind
                            </p>

                            <p className="text-slate-400 mt-2">
                                Atmospheric Pressure
                            </p>

                        </div>


                        <div>

                            <h4 className="font-semibold mb-4">
                                Explore
                            </h4>

                            <p className="text-slate-400">
                                Current Weather
                            </p>

                            <p className="text-slate-400 mt-2">
                                Weather Highlights
                            </p>

                            <p className="text-slate-400 mt-2">
                                Weather Guide
                            </p>

                        </div>

                    </div>

                    <div className="border-t border-slate-800 mt-12 pt-7 text-center text-slate-500">

                        <p>
                            © {new Date().getFullYear()} WeatherIQ. All rights reserved.
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;

