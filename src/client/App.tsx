import '@/styles/main.css';
import '@/styles/themes/dark-cosmic.css';
import '@/styles/themes/cyber-neon.css';
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  AiConversations,
  CreateEvents,
  Events,
  Signup,
  Task,
  Home,
  Dashboard,
  Notifications,
  AccountSettings,
} from './views/index';
const Chatroom = lazy(() => import('./views/Chatroom'));
import { NavBar } from './components/NavBar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import { UserType, UserContext } from './contexts/UserContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import { BackgroundGlow } from '@/components/ui/background-glow';
import { Logout } from './components/auth/Logout';
import { Footer } from '../components/ui/footer';

function LayoutContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
      {/* Add a higher z-index for the navbar container */}
      <div className="relative z-20">
        {isAuthenticated && <NavBar />}
      </div>
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Layout() {
  return <LayoutContent />;
}

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
          <Routes>

            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/aiconversations" element={<AiConversations />} />
                <Route
                  path="/chatroom/*"
                  element={
                    <Suspense
                      fallback={
                        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12">
                          <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
                          <div className="flex items-center justify-center w-screen pt-40">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                              Loading...
                            </h1>
                          </div>
                        </div>
                      }
                    >
                      <Chatroom />
                    </Suspense>
                  }
                />
                <Route path="/createevents" element={<CreateEvents />} />
                <Route path="/events" element={<Events />} />
                <Route path="/task" element={<Task />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<AccountSettings />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </AuthProvider>
  );
}
