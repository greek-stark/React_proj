import React, { useState, useEffect, useCallback } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { useDebounce } from '../hooks/useDebounce';
import { isValidCityName, sanitizeCityName } from '../utils/weatherHelpers';

const SearchBar = ({ onSearch, placeholder = 'Search city...' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { recentSearches, loadCityWeather } = useWeatherContext();
  const debouncedQuery = useDebounce(query, 300);

  const generateSuggestions = useCallback((searchQuery) => {
    const popularCities = [
      'London', 'New York', 'Mumbai', 'Delhi', 'Tokyo', 
      'Paris', 'Dubai', 'Singapore', 'Sydney', 'Los Angeles'
    ];
    
    const allSuggestions = [
      ...recentSearches.filter(city => 
        city.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      ...popularCities.filter(city => 
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ];
    
    const uniqueSuggestions = [...new Set(allSuggestions)].slice(0, 5);
    setSuggestions(uniqueSuggestions);
    setShowSuggestions(true);
  }, [recentSearches]);

  useEffect(() => {
    if (debouncedQuery.length > 1) {
      generateSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, generateSuggestions]);

  const handleSearch = async (cityName) => {
    const sanitizedCity = sanitizeCityName(cityName);
    
    if (!isValidCityName(sanitizedCity)) {
      alert('Please enter a valid city name');
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
      await loadCityWeather(sanitizedCity);
      setQuery('');
      if (onSearch) onSearch(sanitizedCity);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (city) => {
    handleSearch(city);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length > 1) setShowSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isSearching}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
        {query && !isSearching && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(city)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <div className="flex items-center space-x-2">
               
                <span>{city}</span>
                {recentSearches.includes(city) && (
                  <span className="text-xs text-gray-400">Recent</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && query.length > 1 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">No matching cities found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try: London, New York, Tokyo, etc.</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;