import axios from 'axios';
import { WeatherData } from '../../types/dashboard';

export const getWeatherByLocation = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(`/api/weather/current?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};
