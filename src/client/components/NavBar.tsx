import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Transition } from '@headlessui/react';
import {
  FaCalendarAlt, // Events
  FaCalendarPlus, // Create Event
  FaRobot, // AI
  FaTasks, // Task
  FaChartLine, // Dashboard
  FaSignOutAlt, // Logout
} from 'react-icons/fa';
import cn from '../../../lib/utils';
// Import icons

function NavBar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navigation items with icons
  const navItems = [
    { title: 'Events', url: '/Events', icon: FaCalendarAlt },
    { title: 'Create Event', url: '/CreateEvents', icon: FaCalendarPlus },
    { title: 'AI', url: '/AiConversations', icon: FaRobot },
    { title: 'Task', url: '/Task', icon: FaTasks },
    { title: 'Dashboard', url: '/Dashboard', icon: FaChartLine },
    { title: 'Logout', url: '/logout', icon: FaSignOutAlt },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-black/50 backdrop-blur-lg border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <a
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text"
            >
              Flare
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ title, url, icon: Icon }) => (
              <motion.a
                key={title}
                href={url}
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-yellow-500 group-hover:text-orange-500 transition-colors" />
                {title}
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 relative">
                <motion.span
                  className={cn(
                    'absolute h-0.5 w-6 bg-current transform transition-all duration-300',
                    isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  )}
                />
                <motion.span
                  className={cn(
                    'absolute h-0.5 w-6 bg-current transform transition-all duration-300',
                    isOpen ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <motion.span
                  className={cn(
                    'absolute h-0.5 w-6 bg-current transform transition-all duration-300',
                    isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={isOpen}
        enter="transition duration-300 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-200 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/80 backdrop-blur-lg">
            {navItems.map(({ title, url, icon: Icon }) => (
              <motion.a
                key={title}
                href={url}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md flex items-center gap-3"
                whileHover={{ x: 10 }}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="text-orange-500" />
                {title}
              </motion.a>
            ))}
          </div>
        </div>
      </Transition>
    </nav>
  );
}

export default NavBar;
