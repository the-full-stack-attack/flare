import React, { createContext, useMemo } from 'react';
import { io } from 'socket.io-client';
import SOCKET_URL from '../../../config';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  // Create the socket instance once using useMemo
  const socket = useMemo(() => io(SOCKET_URL), []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;