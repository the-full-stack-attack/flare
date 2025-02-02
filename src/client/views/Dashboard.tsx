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
} from 'react-icons/fa';
import TaskDisplay from '../components/tasks/TaskDisplay';
import ChooseTask from '../components/tasks/ChooseTask';
import { UserContext } from '../contexts/UserContext';
import AvatarSelection from '../components/signup/avatarSelection';
import { BackgroundGlow } from '../../components/ui/background-glow';
import cn from '../../../lib/utils';

function Dashboard() {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState<object | null>({});

  useEffect(() => {
    const { current_task_id } = user;
    if (current_task_id) {
      axios
        .get(`/api/task/${current_task_id}`)
        .then(({ data }) => {
          setTask(data);
        })
        .catch((err) => {
          console.error('Error GETting task by id: ', err);
        });
    }
  }, [user]);

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
      value: user.total_tasks_complete || 0,
      color: 'from-orange-500 to-pink-500',
    },
    {
      id: 'streak',
      icon: FaRocket,
      label: 'Current Streak',
      value: '3 days', // You can add this to your user model
      color: 'from-pink-500 to-purple-500',
    },
  ];

  const achievements = [
    {
      icon: FaStar,
      title: 'First Step',
      description: 'Completed your first social task',
      earned: true,
    },
    {
      icon: FaUsers,
      title: 'Social Butterfly',
      description: 'Attended 5 events',
      earned: user.events_attended >= 5,
    },
    {
      icon: FaChartLine,
      title: 'Consistency King',
      description: 'Maintained a 7-day streak',
      earned: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              {user.username || 'Explorer'}
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Let's continue your journey to social confidence
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/10"
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
        </motion.div>

        {/* Task Display */}
        <TaskDisplay task={task} />

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
                transition={{ delay: 0.4 + index * 0.1 }}
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
                <p className="text-gray-400 text-sm">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
