import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface NotificationBellProps {
  count: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count }) => {
  return (
    <Link to="/notifications" className="relative">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
      >
        <FaBell className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
            {count}
          </span>
        )}
      </motion.div>
    </Link>
  );
};
