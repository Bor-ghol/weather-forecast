export interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  visibility: number;
  icon: string;
  sunrise: number;
  sunset: number;
}

export interface ForecastDay {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  humidity: number;
}

export interface WeatherError {
  message: string;
  code?: string;
}
