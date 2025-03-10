import React, { createContext, useMemo, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import SOCKET_URL from '../../../config';

// Define the context type
interface SocketContextType {
  socket: Socket;
}

const SocketContext = createContext<Socket | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  // Create the socket instance once using useMemo
  const socket = useMemo(() => io(SOCKET_URL, { autoConnect: true }), []);

  useEffect(() => {
    return () => {
      socket.disconnect(); // Clean up socket connection on unmount
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextType };