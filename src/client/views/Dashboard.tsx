import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import {
  FaTrophy,
  FaCalendarCheck,
  FaUsers,
  FaChartLine,
  FaStar,
  FaRocket,
  FaTasks,
  FaMedal,
  FaCheckCircle,
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
  ResponsiveContainer,
} from 'recharts';
import TaskDisplay from '../components/tasks/TaskDisplay';
import { UserContext } from '../contexts/UserContext';
import { BackgroundGlow } from '../../components/ui/background-glow';
import cn from '../../../lib/utils';
import PhoenixLogo from '../assets/logo/phoenix.png';
import { WeatherPlaceholder } from '../components/dashboard/WeatherPlaceholder';
import { ErrorBoundary } from '../../components/ErrorBoundary';

type Task = {
  id: number;
  description: string;
  type: string;
  completed_count: number;
  date: string;
  difficulty: number;
};

type IconType = typeof FaStar | typeof FaUsers | typeof FaChartLine;

interface Achievement {
  icon: IconType;
  title: string;
  description: string;
  earned: boolean;
}

function Dashboard() {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState<Task | object>({});
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const stats = [
    {
      id: 1,
      label: 'Total Tasks',
      value: '24',
      icon: FaTasks,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 2,
      label: 'Events',
      value: '12',
      icon: FaCalendarCheck,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 3,
      label: 'Achievements',
      value: '8',
      icon: FaTrophy,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 4,
      label: 'Progress',
      value: '75%',
      icon: FaRocket,
      color: 'from-green-500 to-emerald-500',
    },
  ];

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

  const achievementColors: Record<string, string> = {
    FaStar: 'from-yellow-500 to-amber-500',
    FaUsers: 'from-blue-500 to-cyan-500',
    FaChartLine: 'from-purple-500 to-pink-500',
  } as const;

  useEffect(() => {
    const { current_task_id } = user;
    if (current_task_id) {
      axios
        .get(`/api/task/${current_task_id}`)
        .then(({ data }) => {
          setTask(data);
        })
        .catch((err) => console.error('Error fetching task:', err));
    }
  }, [user]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12">
        <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
        {showConfetti && (
          <Confetti
            width={width}
            height={height * 5}
            numberOfPieces={height * 5}
            recycle={false}
          />
        )}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <h1 className="text-4xl md:text-7xl font-bold mb-4 leading-tight text-white/90">
                Welcome back,{' '}
                <span className="block mt-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {user.full_name || user.username || 'Explorer'}
                </span>
              </h1>
              <p className="text-xl text-gray-300">
                Ready to continue your journey?
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col md:flex-row items-center gap-6 md:max-w-xl"
            >
              <motion.img
                src={PhoenixLogo}
                alt="Phoenix"
                className="w-32 h-32 object-contain"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-3">
                  Rise Like a Phoenix
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Just as the phoenix rises from the ashes, transformed and
                  renewed, you too have the power to break free and emerge
                  stronger. Every step forward is part of your journey to
                  becoming your most authentic self.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 mb-12">
            {/* First Row */}
            <div className="md:col-span-3 lg:col-span-4">
              <WeatherPlaceholder />
            </div>

            {/* Stats in a 2x2 grid */}
            <div className="md:col-span-3 lg:col-span-8">
              <div className="grid grid-cols-2 gap-4 h-full">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
                    <div className="relative h-full rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-6 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <stat.icon
                            className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                          />
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.2, type: 'spring' }}
                            className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                          >
                            {stat.value}
                          </motion.span>
                        </div>
                        <h3
                          className={`font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                        >
                          {stat.label}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <TaskDisplay task={task} setShowConfetti={setShowConfetti} />
          </motion.div>

          <div className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
            <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaTrophy className="text-2xl bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent" />
                    <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      Your Achievements
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement: Achievement, index) => {
                    const Icon = achievement.icon;
                    // Use a simpler approach to get the icon name
                    const iconName = Icon.name || 'FaStar'; // Fallback to FaStar if name is undefined
                    const colorClass =
                      achievementColors[iconName] ||
                      'from-yellow-500 to-orange-500'; // fallback color

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300"
                      >
                        <div className="p-2 rounded-lg bg-white/[0.03]">
                          <Icon
                            className={`text-xl bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}
                          />
                        </div>
                        <div>
                          <p
                            className={`font-medium bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}
                          >
                            {achievement.title}
                          </p>
                          <p className="text-white/60 text-sm">
                            {achievement.description}
                          </p>
                          <span
                            className={`text-xs ${achievement.earned ? 'text-green-500' : 'text-gray-500'}`}
                          >
                            {achievement.earned
                              ? '✓ Earned'
                              : '◯ Not Yet Earned'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
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
                  <a
                    href="https://github.com/the-full-stack-attack/flare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-bold hover:opacity-80 transition-opacity"
                  >
                    Full Stack Attack
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;
