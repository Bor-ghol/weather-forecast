import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ForecastDay } from '@/types/weather';

interface ForecastCardProps {
  forecast: ForecastDay[];
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          5-Day Forecast
        </Typography>
        
        <Grid container spacing={2}>
          {forecast.map((day, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {formatDate(day.date)}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <img
                    src={getWeatherIcon(day.icon)}
                    alt={day.description}
                    style={{ width: 60, height: 60 }}
                  />
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{
                    textTransform: 'capitalize',
                    mb: 1,
                    minHeight: '2.5em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {day.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {day.temperature.max}°
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    {day.temperature.min}°
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  💧 {day.humidity}%
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};