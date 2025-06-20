import { useState, useCallback } from 'react';
import { WeatherData, ForecastDay, WeatherError } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);

  const fetchWeatherByCity = useCallback(async (city: string) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const currentResponse = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!currentResponse.ok) {
        throw new Error(
          currentResponse.status === 404 
            ? 'City not found. Please check the spelling and try again.'
            : 'Failed to fetch weather data. Please try again later.'
        );
      }

      const currentData = await currentResponse.json();

      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastResponse.json();

      const weatherData: WeatherData = {
        name: currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        pressure: currentData.main.pressure,
        feelsLike: Math.round(currentData.main.feels_like),
        visibility: currentData.visibility / 1000, // Convert to km
        icon: currentData.weather[0].icon,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
      };

      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set();

      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        
        if (!processedDates.has(date) && dailyForecasts.length < 5) {
          processedDates.add(date);
          dailyForecasts.push({
            date: item.dt_txt.split(' ')[0],
            temperature: {
              min: Math.round(item.main.temp_min),
              max: Math.round(item.main.temp_max),
            },
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
          });
        }
      });

      setCurrentWeather(weatherData);
      setForecast(dailyForecasts);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByLocation = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const currentResponse = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!currentResponse.ok) {
        throw new Error('Failed to fetch weather data for your location.');
      }

      const currentData = await currentResponse.json();
      
      await fetchWeatherByCity(currentData.name);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Failed to get weather for your location',
      });
    } finally {
      setLoading(false);
    }
  }, [fetchWeatherByCity]);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation,
  };
};
