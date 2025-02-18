import React from 'react';
import { motion } from 'framer-motion';
import {
  FaGoogle,
  FaRocket,
  FaCalendarAlt,
  FaUsers,
  FaRobot,
  FaTasks,
} from 'react-icons/fa';
import { Button } from '../../components/ui/button';
import { BackgroundGlow } from '../../components/ui/background-glow';
import { LandingNav } from '../../components/ui/landing-nav';

function Home() {
  const features = [
    {
      id: 'social-events',
      icon: FaCalendarAlt,
      title: 'Discover Events',
      description:
        'Find and join local events that match your interests, with people just like you',
    },
    {
      id: 'ai-companion',
      icon: FaRobot,
      title: 'AI Social Coach',
      description:
        'Get personalized support and tips to manage social anxiety and build confidence',
    },
    {
      id: 'daily-growth',
      icon: FaTasks,
      title: 'Daily Challenges',
      description:
        'Complete engaging tasks designed to help you step out of your comfort zone',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden">
      <LandingNav />
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Turn Social Anxiety into Social Energy
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Your personal companion for breaking free from social anxiety
                and discovering a more connected life
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Button
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500
                         hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600
                         text-white px-8 py-4 rounded-xl text-lg"
              >
                <a href="/auth" className="flex items-center">
                  Sign Up Now
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-black/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Your Path to Social Confidence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-yellow-500/20"
              >
                <feature.icon className="text-4xl text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl">
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
  );
}

export default Home;
