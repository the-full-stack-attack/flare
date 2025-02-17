import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, avatarUrl }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute right-0 mt-2 w-48 rounded-lg bg-black/90 backdrop-blur-lg border border-yellow-500/20 shadow-lg"
        >
          <div className="py-1">
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <FaCog className="mr-2" />
              Settings
            </Link>
            <Link
              to="/logout"
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};