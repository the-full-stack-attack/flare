import express, { Request, Response, Router } from 'express';
import axios from 'axios';

const weatherRouter: Router = Router();

interface WeatherQueryParams {
  lat?: string;
  lon?: string;
}

weatherRouter.get('/current', async (
  req: Request<{}, any, any, WeatherQueryParams>,
  res: Response
): Promise<void> => {
  const { lat, lon } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    res.status(400).send({ error: 'Latitude and longitude are required' });
    return;
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const weatherData = {
      temp: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      temp_min: response.data.main.temp_min,
      temp_max: response.data.main.temp_max,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      city: response.data.name,
      country: response.data.sys.country,
      wind_speed: response.data.wind.speed,
      wind_deg: response.data.wind.deg,
      clouds: response.data.clouds.all,
      visibility: response.data.visibility,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset
    };

    res.send(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).send({ error: 'Failed to fetch weather data' });
  }
});

export default weatherRouter;

