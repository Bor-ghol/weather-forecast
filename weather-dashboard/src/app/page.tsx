'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { SearchBar } from '@/components/SearchBar';
import { WeatherCard } from '@/components/WeatherCard';
import { ForecastCard } from '@/components/ForecastCard';
import { useWeather } from '@/hooks/useWeather';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const {
    currentWeather,
    forecast,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation,
  } = useWeather();

  useEffect(() => {
    const saved = localStorage.getItem('recentWeatherSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (city: string) => {
    fetchWeatherByCity(city);
    
    const updated = [city, ...recentSearches.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentWeatherSearches', JSON.stringify(updated));
  };

  const handleLocationSearch = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentWeatherSearches');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Weather Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'text.secondary', fontWeight: 500 }}
            >
              Get current weather and 5-day forecast for any city
            </Typography>
          </Box>

          <SearchBar
            onSearch={handleSearch}
            onLocationSearch={handleLocationSearch}
            loading={loading}
            recentSearches={recentSearches}
            onClearRecent={handleClearRecent}
          />

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '1rem',
                },
              }}
            >
              {error.message}
            </Alert>
          )}

          {currentWeather && !loading && (
            <Box>
              <WeatherCard weather={currentWeather} />
              {forecast.length > 0 && <ForecastCard forecast={forecast} />}
            </Box>
          )}

          {!currentWeather && !loading && !error && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, opacity: 0.7 }}>
                🌤️
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Welcome to Weather Dashboard
              </Typography>
              <Typography variant="body1">
                Search for a city or use your current location to get started
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
