import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router';
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
} from './views/index';
import NavBar from './components/NavBar';
import './styles/main.css';

import { UserType, UserContext } from './contexts/UserContext';

export default function App() {
  const [user, setUser] = useState<UserType>({ id: 0 });
  const getUser = () => {
    axios
      .get('/api/user')
      .then(({ data }: any) => {
        setUser(data);
      })
      .catch((err: unknown) => {
        console.error('Failed to getUser:', err);
      });
  };
  const userState = useMemo(
    () => ({
      user,
      setUser,
      getUser,
    }),
    [user]
  );

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={userState}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="AiConversations" element={<AiConversations />} />
          <Route path="/Chatroom/*" element={<Chatroom />} />
          <Route path="CreateEvents" element={<CreateEvents />} />
          <Route path="Events" element={<Events />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="Task" element={<Task />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
