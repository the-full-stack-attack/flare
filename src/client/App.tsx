import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import {
  AiConversations,
  Chatroom,
  CreateEvents,
  Events,
  Signup,
  Task,
  Home,
} from './views/index';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="AiConversations" element={<AiConversations />} />
        <Route path="Chatroom" element={<Chatroom />} />
        <Route path="CreateEvents" element={<CreateEvents />} />
        <Route path="Events" element={<Events />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="Task" element={<Task />} />
        <Route path="Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
