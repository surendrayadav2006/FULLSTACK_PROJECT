import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketRef.current = io('http://localhost:5000', { auth: { token } });
      socketRef.current.on('onlineUsers', (users) => setOnlineUsers(users));
      socketRef.current.on('connect_error', (err) => console.error('Socket error:', err.message));
    }
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
