import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useAuth } from '../../client/contexts/AuthContext';
import { Logo } from '../../client/components/Logo';
import { Link } from 'react-router-dom';

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
            <Logo size="md" animate={true} className="py-2" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500
                       hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600
                       text-white px-6 py-2 rounded-lg"
            >
              <Link to="/auth">Log In</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}

