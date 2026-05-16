import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }
  
  // Используем правильный URL для WebSocket
  const SOCKET_URL = 'http://localhost:5001';
  
  socket = io(SOCKET_URL, {
    path: '/api/v1/ws',
    transports: ['websocket', 'polling'],
    auth: {
      token,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  });
  
  socket.on('connect', () => {
    console.log('✅ WebSocket connected successfully');
  });
  
  socket.on('connect_error', (error) => {
    console.error('WebSocket connect error:', error);
  });
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket first.');
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initSocket,
  getSocket,
  closeSocket,
};
