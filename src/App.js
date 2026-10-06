import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WeatherProvider } from './context/WeatherContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Details from './pages/Details';
import WeatherMap from './pages/WeatherMap';
import Alerts from './pages/Alerts';

import './App.css';

function App() {
  return (
    <WeatherProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/details" element={<Details />} />
            <Route path="/map" element={<WeatherMap />} />
            <Route path="/alerts" element={<Alerts />} />
            
          </Routes>
        </div>
      </Router>
    </WeatherProvider>
  );
}

export default App;
