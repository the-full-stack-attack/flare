import '@/styles/main.css'; // Main styles
import '@/styles/themes/dark-cosmic.css'; // Theme styles
import '@/styles/themes/cyber-neon.css'; // Theme styles
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import {
  AiConversations,
  Chatroom,
  CreateEvents,
  Events,
  Signup,
  Task,
  Home,
  Dashboard,
  Notifications,
  AccountSettings,
} from './views/index';
import { NavBar } from './components/NavBar';
import '../styles/main.css';

import { UserType, UserContext } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';

import { BackgroundGlow } from '@/components/ui/background-glow';
import { Logout } from './components/auth/Logout';

export default function App() {
  const [user, setUser] = useState<UserType>({
    id: 0,
    Interests: [],
    Notifications: [],
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    axios
      .get('/api/user')
      .then(({ data }: { data: UserType; }) => {
        setUser(data);
        setIsAuthenticated(true);
      })
      .catch((err: unknown) => {
        console.error('Failed to getUser:', err);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const userState = useMemo(
    () => ({
      user,
      setUser,
      getUser,
      isAuthenticated,
    }),
    [user, isAuthenticated]
  );

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12">
        <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
        <div className="flex items-center justify-center w-screen pt-40">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <UserContext.Provider value={userState}>
        <BrowserRouter>
          {isAuthenticated && <NavBar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="Signup" element={<Signup />} />
            <Route path="logout" element={<Logout />} />

            {/* Protected Routes */}
            {isAuthenticated ? (
              <>
                <Route path="AiConversations" element={<AiConversations />} />
                <Route path="/Chatroom/*" element={<Chatroom />} />
                <Route path="CreateEvents" element={<CreateEvents />} />
                <Route path="Events" element={<Events />} />
                <Route path="Task" element={<Task />} />
                <Route path="Notifications" element={<Notifications />} />
                <Route path="Dashboard" element={<Dashboard />} />
                <Route path='Settings' element={<AccountSettings />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </AuthProvider>
  );
}
