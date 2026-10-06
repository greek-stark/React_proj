import { useState, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('weather-favorites', []);

  const addFavorite = useCallback((city) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.name === city.name)) {
        return prev;
      }
      return [...prev, city];
    });
  }, [setFavorites]);

  const removeFavorite = useCallback((cityName) => {
    setFavorites((prev) => prev.filter((fav) => fav.name !== cityName));
  }, [setFavorites]);

  const isFavorite = useCallback((cityName) => {
    return favorites.some((fav) => fav.name === cityName);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useLocalStorage('weather-recent-searches', []);

  const addRecentSearch = useCallback((city) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== city);
      return [city, ...filtered].slice(0, 10);
    });
  }, [setRecentSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
};