import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaTrophy,
  FaCalendarCheck,
  FaUsers,
  FaChartLine,
  FaStar,
  FaRocket,
  FaCloud,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import TaskDisplay from '../components/tasks/TaskDisplay';
import { UserContext } from '../contexts/UserContext';
import { BackgroundGlow } from '../../components/ui/background-glow';
import cn from '../../../lib/utils';
import PhoenixLogo from '../assets/logo/phoenix.png';
import { Weather } from '../components/dashboard/Weather';
import { getWeather, getCurrentLocation } from '../services/weather';
import { WeatherData, Location, StatCard, Achievement, Task } from '../../types/dashboard';
import { ErrorBoundary } from '../../components/ErrorBoundary';


function Dashboard() {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState<object | null>({});
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [weatherError, setWeatherError] = useState<string>('');
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // Fetch current task on component mount
  useEffect(() => {
    const { current_task_id } = user;
    if (current_task_id) {
      axios.get(`/api/task/${current_task_id}`)
        .then(({ data }) => {
          setTask(data);
        })
        .catch((err) => console.error('Error fetching task:', err));
    }
  }, [user]);

  // Get user location and fetch weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (error) => console.error('Error getting location:', error)
      );
    }
  }, []);

  // Fetch weather data when location is available
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const location = await getCurrentLocation();
        const weatherData = await getWeather(location);
        setWeather(weatherData);
      } catch (error) {
        setWeatherError(error instanceof Error ? error.message : 'Failed to fetch weather');
      } finally {
        setIsLoadingWeather(false);
      }
    };

    if (location) {
      fetchWeather();
    }
  }, [location]);

  // Stats cards data
  const stats = [
    {
      id: 'events',
      icon: FaCalendarCheck,
      label: 'Events Attended',
      value: user.events_attended || 0,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'tasks',
      icon: FaTrophy,
      label: 'Tasks Completed',
      value: user.total_tasks_completed || 0,
      color: 'from-orange-500 to-pink-500',
    },
    {
      id: 'weeklyTasks',
      icon: FaRocket,
      label: 'Weekly Tasks',
      value: user.weekly_task_count || 0,
      color: 'from-pink-500 to-purple-500',
    },
  ];

  // Achievements data
  const achievements = [
    {
      icon: FaStar,
      title: 'First Step',
      description: 'Completed your first social task',
      earned: (user.total_tasks_completed || 0) > 0,
    },
    {
      icon: FaUsers,
      title: 'Social Butterfly',
      description: 'Attended 5 events',
      earned: (user.events_attended || 0) >= 5,
    },
    {
      icon: FaChartLine,
      title: 'Weekly Warrior',
      description: 'Completed all weekly tasks',
      earned: (user.weekly_task_count || 0) >= 7,
    },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12">
        <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

        {/* Main content container */}
        <div className="relative z-10 container mx-auto px-4">

          {/* Hero Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              Welcome back
            </h1>
            <h2 className="text-3xl md:text-5xl bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-bold">
            {user.full_name || user.username || 'Explorer'}
            </h2>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

            {/* Weather Component */}
            <Weather
              weather={weather}
              isLoading={isLoadingWeather}
              error={weatherError}
            />

            {/* Stats Cards */}
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="col-span-1 backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon
                    className={`text-3xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2, type: 'spring' }}
                    className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </motion.div>
                </div>
                <h3 className="text-gray-300 text-lg">{stat.label}</h3>
              </motion.div>
            ))}

            {/* Phoenix Message Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-1 md:col-span-2 backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center space-x-6">
                <img src={PhoenixLogo} alt="Phoenix" className="w-24 h-24 object-contain" />
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
                    Rise Like a Phoenix
                  </h3>
                  <p className="text-gray-300">
                    Just as the phoenix rises from the ashes, transformed and renewed,
                    you too have the power to break free and emerge
                    stronger. Every step you take, every event you attend, and every
                    connection you make is part of your journey to becoming your most
                    authentic, confident self.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Task Display Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <TaskDisplay className="w-full" task={task} />
          </motion.div>

          {/* Achievements Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={cn(
                    'backdrop-blur-lg rounded-xl p-6 border',
                    achievement.earned
                      ? 'bg-white/10 border-yellow-500/30'
                      : 'bg-white/5 border-white/10'
                  )}
                >
                  <div className="flex items-center mb-4">
                    <achievement.icon
                      className={cn(
                        'text-2xl mr-3',
                        achievement.earned ? 'text-yellow-500' : 'text-gray-500'
                      )}
                    />
                    <h3
                      className={cn(
                        'font-bold',
                        achievement.earned ? 'text-white' : 'text-gray-400'
                      )}
                    >
                      {achievement.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">
                2024 Flare. All rights reserved.
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span className="text-gray-400">by</span>
                <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-bold">
                  Full Stack Attack
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;

