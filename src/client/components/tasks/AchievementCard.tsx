import React, { useState } from 'react';
import { motion } from 'framer-motion';
import cn from 'lib/utils';
import {
  FaTrophy,
  FaCalendarCheck,
  FaUsers,
  FaChartLine,
  FaStar,
  FaRocket,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

type AchievementCardType = {
  achievement: FlareType;
  index: number;
};
type FlareType = {
  id?: number;
  name: string;
  type: string | void;
  icon: IconType;
  achievement: string;
  value: number;
  milestone: number | null;
  description: string;
}
function AchievementCard({ achievement, index }: AchievementCardType) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className={cn(
        'backdrop-blur-lg rounded-xl p-6 border', 'bg-white/10 border-yellow-500/30'
      )}
    >
      <div className="flex items-center mb-4">
        <achievement.icon
          className={cn(
            'text-2xl mr-3',
            'text-yellow-500'
          )}
        />
        <h3
          className={cn(
            'font-bold', 'text-white'
          )}
        >
          {achievement.name}
        </h3>
      </div>
      <p className="text-gray-400 text-sm">{achievement.description}</p>
    </motion.div>
  );
}

export default AchievementCard;
