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

type FlareType = {
  id: number;
  name: string;
  type: string | void;
  icon: string;
  achievement: string;
  milestone: string;
  description: string;
  value: number;
};

function Dashboard() {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState<Task | object>({});
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [completeDisabled, setCompleteDisabled] = useState(false);
  const [userFlares, setUserFlares] = useState<FlareType[]>([]);
  const [closestEvent, setClosestEvent] = useState<{ title: string } | null>(null);
  const [latestFlare, setLatestFlare] = useState<{ name: string } | null>(null);

  const stats = [
    {
      id: 1,
      label: 'Total Tasks Completed',
      value: user.total_tasks_completed?.toString() || '0',
      icon: FaTasks,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 2,
      label: 'Upcoming Event',
      value: closestEvent || 'None scheduled',
      icon: FaCalendarCheck,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 3,
      label: 'Recent Flare',
      value: latestFlare || 'Earn more!',
      icon: FaMedal,
      color: 'from-yellow-500 to-orange-500',
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
    const { id } = user;
    axios
      .get(`/api/flare/${id}`)
      .then(({ data }) => {
        setUserFlares(data);
      })
      .catch((err) => {
        console.error('Error GETing user flares on AccountSettings: ', err);
      });
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/events/nearest');
        setClosestEvent(response.data);
      } catch (error) {
        console.error('Error fetching closest event:', error);
      }
    };

    fetchData();
  }, [user.id]);

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
        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header Section with Total Tasks */}
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
              <div className="flex items-center gap-4">
                <FaTrophy className="text-2xl text-yellow-500" />
                <p className="text-xl text-gray-300">
                  Tasks Completed: {user.total_tasks_completed || 0}
                </p>
              </div>
            </motion.div>

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
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Weather Panel */}
            <div className="lg:col-span-1">
              <WeatherPlaceholder />
            </div>

            {/* Events & Task Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Event */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-xl bg-black/30 backdrop-blur-lg border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FaCalendarCheck className="text-2xl text-blue-500" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    Next Event
                  </h2>
                </div>
                <p className="text-gray-200 text-lg">
                  {closestEvent?.title || 'No upcoming events scheduled'}
                </p>
              </motion.div>

              {/* Current Task */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TaskDisplay
                  task={task}
                  completeDisabled={completeDisabled}
                  setShowConfetti={setShowConfetti}
                  setCompleteDisabled={setCompleteDisabled}
                />
              </motion.div>
            </div>
          </div>

          {/* Flares/Achievements Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FaMedal className="text-2xl text-yellow-500" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Recent Flares
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userFlares.slice(-3).map((flare, index) => (
                <motion.div
                  key={flare.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={flare.icon}
                      alt={flare.name}
                      className="w-12 h-12 object-contain rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-100">{flare.name}</p>
                      <p className="text-sm text-gray-400">{flare.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Keep existing footer */}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;