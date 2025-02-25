import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaThermometerHalf, 
  FaWind, 
  FaCloud, 
  FaEye, 
  FaTint,
  FaSun,
  FaMoon,
  FaExchangeAlt
} from 'react-icons/fa';
import { getWeatherByLocation } from '../../services/weather';
import { WeatherData } from '../../../types/dashboard';

export const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isCelsius, setIsCelsius] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const weatherData = await getWeatherByLocation(
              position.coords.latitude,
              position.coords.longitude
            );
            setWeather(weatherData);
            setLoading(false);
          } catch (err) {
            setError('Failed to fetch weather data');
            setLoading(false);
          }
        },
        () => {
          setError('Location access denied');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported');
      setLoading(false);
    }
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const celsiusToFahrenheit = (celsius: number) => {
    return (celsius * 9/5) + 32;
  };

  const formatTemp = (temp: number) => {
    return Math.round(isCelsius ? temp : celsiusToFahrenheit(temp));
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
        <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
        <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/20 rounded w-1/4" />
            <div className="h-8 bg-white/20 rounded w-1/2" />
            <div className="h-4 bg-white/20 rounded w-1/3" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
      <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-4">
        {weather && (
          <div className="space-y-6">
            {/* Header with Temperature Toggle */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  Local Weather
                </h3>
                <div className="flex items-center text-sm text-white/60">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>
                    {weather.city}, {weather.country}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCelsius(!isCelsius)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
              >
                <FaExchangeAlt className="text-white/60" />
                <span className="text-white/60 text-sm">°C</span>
              </button>
            </div>

            {/* Main Temperature Display */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 capitalize">{weather.description}</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {formatTemp(weather.temp)}°{isCelsius ? 'C' : 'F'}
                </p>
                <p className="text-sm text-white/60">
                  Feels like {formatTemp(weather.feels_like)}°{isCelsius ? 'C' : 'F'}
                </p>
              </div>
              
              <motion.img
                src={`https://openweathermap.org/img/w/${weather.icon}.png`}
                alt="Weather icon"
                className="w-16 h-16"
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <FaThermometerHalf className="text-orange-500/80" />
                  <span className="text-white/60 text-sm">Min/Max</span>
                </div>
                <p className="text-white/80">
                  {formatTemp(weather.temp_min)}° / {formatTemp(weather.temp_max)}°
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <FaTint className="text-blue-500/80" />
                  <span className="text-white/60 text-sm">Humidity</span>
                </div>
                <p className="text-white/80">{weather.humidity}%</p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <FaWind className="text-cyan-500/80" />
                  <span className="text-white/60 text-sm">Wind</span>
                </div>
                <p className="text-white/80">{Math.round(weather.wind_speed)} m/s</p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <FaCloud className="text-gray-400/80" />
                  <span className="text-white/60 text-sm">Clouds</span>
                </div>
                <p className="text-white/80">{weather.clouds}%</p>
              </div>
            </div>

            {/* Sun Times */}
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <FaSun className="text-yellow-500" />
                <span className="text-white/60">
                  {formatTime(weather.sunrise)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaMoon className="text-gray-400" />
                <span className="text-white/60">
                  {formatTime(weather.sunset)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
