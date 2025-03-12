import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Fireworks from '../components/Fireworks';
import { useWindowSize } from '@react-hook/window-size';
import {
  FaTrophy,
  FaCalendarCheck,
  FaUsers,
  FaChartLine,
  FaStar,
  FaTasks,
  FaMedal,
} from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import TaskDisplay from '../components/tasks/TaskDisplay';
import { UserContext } from '../contexts/UserContext';
import { BackgroundGlow } from '../../components/ui/background-glow';
import PhoenixLogo from '../assets/logo/phoenix.png';
import { Weather } from '../components/dashboard/Weather';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import Event from '../components/events-view/Event';
import { EventData } from '@/types/Events';

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
  notification_message: string;
  card_message: string;
  value: number;
};

function Dashboard() {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState<Task | object>({});
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [completeDisabled, setCompleteDisabled] = useState(false);
  const [userFlares, setUserFlares] = useState<FlareType[]>([]);
  const [unearnedFlares, setUnearnedFlares] = useState<FlareType[]>([]);
  const [closestEvent, setClosestEvent] = useState<EventData | null>(
    null
  );
  const [latestFlare, setLatestFlare] = useState<{ name: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currFlare, setCurrFlare] = useState<null | FlareType>(null);

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
    axios
      .get(`/api/flare/unearned/${id}`)
      .then(({ data }) => {
        setUnearnedFlares(data);
      })
      .catch((err) => {
        console.error('Error GETing user flares on AccountSettings: ', err);
      });
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/event/attend/true', {
          params: {
            now: new Date().toISOString(),
            limit: 1,
          }
        });
        setClosestEvent(response.data[0]);
      } catch (error) {
        console.error('Error fetching closest event:', error);
      }
    };

    fetchData();
  }, [user.id]);

  const handleFlareClick = (flare: FlareType) => {
    setCurrFlare(flare);
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setCurrFlare(null);
  }

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
        {showFireworks && (
          <Fireworks />
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row items-center gap-6 mb-8"
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
              <div className="text-center md:text-left max-w-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-3">
                  Rise Like a Phoenix
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Like the mythical Phoenix rising from its ashes, we believe in
                  continuous personal growth and renewal. Flare helps you
                  transform your social interactions and personal development
                  through mindful challenges, meaningful connections, and guided
                  self-improvement. Let your social confidence soar to new
                  heights.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col gap-8 mb-12">
            {/* Weather and Events Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Weather Panel */}
              <div className="h-full">
                <Weather />
              </div>

              {/* Upcoming Event */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
                <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <FaCalendarCheck className="text-2xl text-blue-500" />
                      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        Next Event
                      </h2>
                    </div>
                    <div className="flex-1 overflow-hidden"> {/* Added overflow control */}
                      {closestEvent ? (
                        <div className="h-full">
                          <Event
                            event={closestEvent}
                            getEvents={() => {}}
                            disableBail={true}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-200 text-lg">
                            No upcoming events scheduled
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Task Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TaskDisplay
                task={task}
                completeDisabled={completeDisabled}
                setShowConfetti={setShowConfetti}
                setShowFireworks={setShowFireworks}
                setCompleteDisabled={setCompleteDisabled}
              />
            </motion.div>

            {/* Flares */}
            <div className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
              <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-6 lg:max-h-[343px] overflow-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FaTrophy className="text-2xl bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent" />
                      <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                        Your Flares
                      </h3>
                    </div>
                  </div>
                  {currFlare && (
                    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
                      <DialogContent>
                        <DialogTitle>{currFlare.name}</DialogTitle>
                        <div className="flex items-start space-x-4">
                          <img
                            className="rounded-full w-24 h-24 object-cover"
                            src={currFlare.icon}
                          />
                          <DialogDescription className="flex-grow">
                            {currFlare.card_message}
                          </DialogDescription>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {userFlares.map((flare: FlareType, index) => {
                      const colorClass = 'from-yellow-500 to-orange-500'; // fallback color
                      return (
                        <motion.div
                          key={index}
                          onClick={() => { handleFlareClick(flare) }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 hover:cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              className="rounded-full w-12 h-12 object-cover" // Fixed size regardless of breakpoint
                              src={flare.icon}
                            />
                            <div className="flex-col">
                              <p
                                className={`font-medium bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}
                              >
                                {flare.name}
                              </p>
                              <p className="text-white/60 text-sm">
                                {flare.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Unearned Flares */}
            <div className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
              <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-6 lg:max-h-[343px] overflow-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FaTrophy className="text-2xl bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent" />
                      <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                        Unearned Flares
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {unearnedFlares.map((flare: FlareType, index) => {
                      const colorClass = 'from-yellow-500 to-orange-500'; // fallback color
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              className="rounded-full w-12 h-12 object-cover blur" // Same fixed size with blur effect
                              src={flare.icon}
                            />
                            <div className="flex-col">
                              <p
                                className={`font-medium bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}
                              >
                                {flare.name}
                              </p>
                              <p className="text-white/60 text-sm">
                                {flare.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;
