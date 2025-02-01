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
import NavBar from './components/NavBar';
import '../styles/main.css';

import { UserType, UserContext } from './contexts/UserContext';

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
      .then(({ data }: any) => {
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
    return <div>Loading...</div>;

  }

  return (
    <UserContext.Provider value={userState}>
      <BrowserRouter>
        {isAuthenticated && <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Signup" element={<Signup />} />

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
            // Redirect to home if trying to access protected routes while not authenticated
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
