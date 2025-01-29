import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useAuth } from '../../client/contexts/AuthContext';

export function LandingNav() {
  const { isAuthenticated } = useAuth();

  // Don't render if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaRocket className="text-orange-500 mr-2 text-2xl" />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Flare
            </span>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
