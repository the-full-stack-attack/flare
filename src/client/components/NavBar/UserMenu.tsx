import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { UserType } from '../../contexts/UserContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: UserType;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, onLogout, user }) => {
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogout();
    onClose();
  };

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
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
