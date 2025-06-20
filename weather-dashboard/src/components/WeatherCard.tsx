import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Thermostat,
  Water,
  Air,
  Compress,
  Visibility,
  WbSunny,
  Brightness3,
} from '@mui/icons-material';
import { WeatherData } from '@/types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const weatherDetails = [
    {
      icon: <Thermostat sx={{ color: 'error.main' }} />,
      label: 'Feels like',
      value: `${weather.feelsLike}°C`,
    },
    {
      icon: <Water sx={{ color: 'info.main' }} />,
      label: 'Humidity',
      value: `${weather.humidity}%`,
    },
    {
      icon: <Air sx={{ color: 'success.main' }} />,
      label: 'Wind Speed',
      value: `${weather.windSpeed} m/s`,
    },
    {
      icon: <Compress sx={{ color: 'warning.main' }} />,
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
    },
    {
      icon: <Visibility sx={{ color: 'secondary.main' }} />,
      label: 'Visibility',
      value: `${weather.visibility} km`,
    },
  ];

  return (
    <Card
      sx={{
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: 4,
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {weather.name}
            </Typography>
            <Chip
              label={weather.country}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={getWeatherIcon(weather.icon)}
              alt={weather.description}
              style={{ width: isMobile ? 80 : 100, height: isMobile ? 80 : 100 }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant={isMobile ? 'h2' : 'h1'}
            component="div"
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            {weather.temperature}°C
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textTransform: 'capitalize',
              opacity: 0.9,
            }}
          >
            {weather.description}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {weatherDetails.map((detail, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                }}
              >
                {detail.icon}
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  {detail.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {detail.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WbSunny sx={{ color: 'warning.light' }} />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Sunrise
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {formatTime(weather.sunrise)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Brightness3 sx={{ color: 'info.light' }} />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Sunset
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {formatTime(weather.sunset)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
