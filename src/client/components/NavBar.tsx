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
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { FaBars, FaTimes } from 'react-icons/fa';

export const NavBar = () => {
  const { user } = useContext(UserContext);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user?.User_Avatar) {
      try {
        const avatar = createAvatar(adventurer, {
          seed: 'Felix',
          skinColor: [user.User_Avatar.skin],
          hair: [user.User_Avatar.hair],
          hairColor: [user.User_Avatar.hair_color],
          eyebrows: [user.User_Avatar.eyebrows],
          eyes: [user.User_Avatar.eyes],
          mouth: [user.User_Avatar.mouth],
        });
        setAvatarUrl(avatar.toDataUriSync());
      } catch (error) {
        console.error('Error generating avatar:', error);
        setAvatarUrl(user.avatar_uri || null);
      }
    } else if (user?.avatar_uri) {
      setAvatarUrl(user.avatar_uri);
    }
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/', { replace: true });
    }
  };

  const navItems = [
    { title: 'Dashboard', url: '/dashboard', icon: FaChartLine },
    { title: 'Events', url: '/events', icon: FaCalendarAlt },
    { title: 'Tasks', url: '/task', icon: FaTasks },
    { title: 'AI Social Coach', url: '/aiconversations', icon: FaRobot },
  ];

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

          {/* Logo - centered on mobile, left on desktop */}
          <div className={cn(
            "flex items-center justify-center",
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "md:static md:left-0 md:transform-none",
            isOpen ? "hidden" : "flex"
          )}>
            <Link to="/dashboard" className="flex items-center">
             <Logo size="md" animate={true} className="h-8 md:h-10 lg:h-12" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(({ title, url, icon: Icon }) => (
              <motion.a
                key={title}
                href={url}
                className="px-3 lg:px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 group text-sm lg:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-yellow-500 group-hover:text-orange-500 transition-colors h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline">{title}</span>
              </motion.a>
            ))}
          </div>

          {/* Right side items (Notifications & User Menu) */}
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
                    className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-500 text-sm md:text-lg">
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
              <motion.a
                key={title}
                href={url}
                className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-3"
                whileHover={{ x: 10 }}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="text-yellow-500 h-5 w-5" />
                {title}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};
