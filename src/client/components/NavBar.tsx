import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Transition } from '@headlessui/react';
import {
  FaCalendarAlt,
  FaCalendarPlus,
  FaRobot,
  FaTasks,
  FaStickyNote,
  FaChartLine,
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';
import cn from '../../../lib/utils';
import { UserContext } from '../contexts/UserContext';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';

export const NavBar = () => {
  const { user } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navigation items with icons
  const navItems = [
    { title: 'Dashboard', url: '/Dashboard', icon: FaChartLine },
    { title: 'Events', url: '/Events', icon: FaCalendarAlt },
    { title: 'Create Event', url: '/CreateEvents', icon: FaCalendarPlus },
    { title: 'Tasks', url: '/Task', icon: FaTasks },
    { title: 'AI', url: '/AiConversations', icon: FaRobot },
    {
      title: `Notifications${user.Notifications.length ? ` (${user.Notifications.length})` : ''}`,
      url: '/Notifications',
      icon: FaStickyNote,
    },
    { title: 'Settings', url: '/settings', icon: FaCog },
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
          ? 'bg-black/50 backdrop-blur-lg border-b border-yellow-500/20'
          : 'bg-transparent border-b border-white/10'
      )}
    >
      <div className="max-w-[2000px] mx-auto">
        <div className="flex justify-between h-20 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/Dashboard" className="flex items-center">
              <Logo
                size="md"
                animate={true}
                className="py-2"
              />
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ title, url, icon: Icon }) => (
              <motion.a
                key={title}
                href={url}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-yellow-500 group-hover:text-orange-500 transition-colors" />
                {title}
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-black/90 backdrop-blur-lg border-t border-white/10"
      >
        <div className="px-4 py-3 space-y-1">
          {navItems.map(({ title, url, icon: Icon }) => (
            <motion.a
              key={title}
              href={url}
              className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-3"
              whileHover={{ x: 10 }}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="text-yellow-500" />
              {title}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};
