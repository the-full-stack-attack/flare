import React from 'react';
import { motion } from 'framer-motion';
import { FaCloud, FaSun, FaMoon } from 'react-icons/fa';
import { WeatherData } from '../../../types/dashboard';

interface WeatherProps {
  weather: WeatherData | null;
  isLoading: boolean;
  error?: string;
}

export const Weather: React.FC<WeatherProps> = ({ weather, isLoading, error }) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-1 backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-red-400">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-1 backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-white/20 h-12 w-12"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/20 rounded w-24"></div>
              <div className="h-4 bg-white/20 rounded w-16"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-1 backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/10"
    >
      {weather && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Current Weather</h3>
            <p className="text-gray-300 capitalize">{weather.description}</p>
            <p className="text-2xl font-bold text-white">{Math.round(weather.temp)}°C</p>
            {weather.city && (
              <p className="text-sm text-gray-400 mt-1">
                {weather.city}, {weather.country}
              </p>
            )}
          </div>
          <img
            src={`https://openweathermap.org/img/w/${weather.icon}.png`}
            alt="Weather icon"
            className="w-16 h-16"
          />
        </div>
      )}
    </motion.div>
  );
};
