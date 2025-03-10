import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaChartLine,
  FaCalendarAlt,
  FaCalendarPlus,
  FaTasks,
  FaRobot,
} from 'react-icons/fa';
import cn from '../../../lib/utils';
import { UserContext } from '../contexts/UserContext';
import { Logo } from './Logo';
import { NotificationBell } from './NavBar/NotificationBell';
import { UserMenu } from './NavBar/UserMenu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createAvatar, Options, StyleOptions } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { FaBars, FaTimes } from 'react-icons/fa';
import { UserAvatar, AvatarConfig, AdventurerOptions } from '@/types/avatar';

export const NavBar = () => {
  const { user, getUser } = useContext(UserContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Navigation items with icons
  const navItems = [
    { title: 'Dashboard', url: '/dashboard', icon: FaChartLine },
    { title: 'Events', url: '/events', icon: FaCalendarAlt },
    { title: 'Tasks', url: '/task', icon: FaTasks },
    { title: 'AI Social Coach', url: '/aiconversations', icon: FaRobot },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/', { replace: true });
    }
  };

  const generateAvatar = async (avatarConfig: AdventurerOptions) => {
    try {
      const avatar = createAvatar(adventurer, avatarConfig);
      const uri = await avatar.toDataUri();
      return uri;
    } catch (error) {
      console.error('Error generating avatar:', error);
      return null;
    }
  };

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateAndSetAvatar = async () => {
      if (user?.User_Avatar) {
        try {
          const avatarConfig: AdventurerOptions = {
            backgroundColor: ['transparent'],
            seed: 'Felix',
            size: 128,
          };

          // Default values in case the schema is undefined
          const defaultVariant = 'variant01';

          const avatar = createAvatar(adventurer, {
            ...avatarConfig,
            backgroundColor: ['transparent'],
            skinColor: [user.User_Avatar.skin],
            hairColor: [user.User_Avatar.hair_color],
            eyebrows: [user.User_Avatar.eyebrows || defaultVariant],
            eyes: [user.User_Avatar.eyes || defaultVariant],
            mouth: [user.User_Avatar.mouth || defaultVariant],
            hair: [user.User_Avatar.hair || defaultVariant],
          } as AdventurerOptions);

          const uri = await avatar.toDataUri();
          setAvatarUrl(uri);
        } catch (error) {
          console.error('Error generating avatar:', error);
          setAvatarUrl(user.avatar_uri || null);
        }
      } else if (user?.avatar_uri) {
        setAvatarUrl(user.avatar_uri);
      }
    };

    generateAndSetAvatar();
  }, [user]);

  useEffect(() => {
    getUser();
    let intervalId = setInterval(() => {
      getUser();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <nav
      className={cn(
        'fixed w-full transition-all duration-300 isolate',
        scrolled
          ? 'bg-black/50 backdrop-blur-lg border-b border-yellow-500/20'
          : 'before:absolute before:inset-0 before:bg-transparent before:z-0 border-b border-white/10'
      )}
    >
      <div className="max-w-[2000px] mx-auto relative z-10">
        <div className="flex justify-between h-16 md:h-20 px-4 md:px-6 lg:px-8">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6 text-yellow-500" />
              ) : (
                <FaBars className="h-6 w-6 text-yellow-500" />
              )}
              <span className="sr-only">
                {isOpen ? 'Close menu' : 'Open menu'}
              </span>
            </motion.button>
          </div>

          {/* Logo */}
          <div
            className={cn(
              "flex items-center justify-center relative z-10",
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "md:static md:left-0 md:transform-none",
              isOpen ? "hidden" : "flex"
            )}
          >
            <Link to="/dashboard" className="flex items-center relative isolate">
              <div className="relative z-10">
                <Logo size="md" animate={true} className="h-8 md:h-10 lg:h-12" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(({ title, url, icon: Icon }) => (
              <Link
                key={title}
                to={url}
                className="group px-3 lg:px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 text-sm lg:text-base"
              >
                <Icon className="text-yellow-500 group-hover:text-orange-500 transition-colors h-5 w-5 lg:h-6 lg:w-6" />
                <span>{title}</span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <NotificationBell count={user.Notifications?.length || 0} />
            <div className="relative">
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="rounded-full border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="h-9 w-9 md:h-11 md:w-11 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-500 text-base md:text-xl">
                      {user.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </motion.button>
              <UserMenu
                isOpen={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
                onLogout={handleLogout}
                user={user}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          className="md:hidden overflow-hidden bg-black/90 backdrop-blur-lg border-t border-white/10"
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ title, url, icon: Icon }) => (
              <Link
                key={title}
                to={url}
                className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="text-yellow-500 h-5 w-5" />
                {title}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};
