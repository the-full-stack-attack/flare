// import axios from 'axios';
// import { WeatherData, Location } from '../../types/dashboard';

// const WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || '';


// // Add error handling if API key is missing
// const validateApiKey = () => {
//   if (!WEATHER_API_KEY) {
//     throw new Error('Weather API key is not configured');
//   }
// };

// export const getWeather = async (location: Location): Promise<WeatherData> => {
//   try {
//     validateApiKey();
//     const { lat, lon } = location;
//     const response = await axios.get(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
//     );

//     return {
//       temp: response.data.main.temp,
//       description: response.data.weather[0].description,
//       icon: response.data.weather[0].icon,
//       city: response.data.name,
//       country: response.data.sys.country
//     };
//   } catch (error) {
//     if (!WEATHER_API_KEY) {
//       throw new Error('Weather service is not configured');
//     }
//     throw new Error('Failed to fetch weather data');
//   }
// };

// export const getCurrentLocation = (): Promise<Location> => {
//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject(new Error('Geolocation is not supported by your browser'));
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         resolve({
//           lat: position.coords.latitude,
//           lon: position.coords.longitude
//         });
//       },
//       (error) => {
//         reject(error);
//       }
//     );
//   });
// };

