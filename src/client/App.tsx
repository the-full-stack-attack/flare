import React, { useState, createContext, useMemo } from 'react';
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
} from './views/index';
import NavBar from './components/NavBar';
import './styles/main.css';

interface User {
  id: number;
  username?: string;
  google_id?: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  tasks_complete?: number;
  events_attended?: number;
  location?: string;
  avatar_id?: number;
  avatar_shirt?: string;
  avatar_pants?: string;
}

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType>({
  user: { id: 0 },
  setUser: () => {},
});

export default function App() {
  const [user, setUser] = useState<User>({ id: 0 });
  const userState = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={userState}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="AiConversations" element={<AiConversations />} />
          <Route path="Chatroom" element={<Chatroom />} />
          <Route path="CreateEvents" element={<CreateEvents />} />
          <Route path="Events" element={<Events />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="Task" element={<Task />} />
          <Route path="Dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
