import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
  const token = localStorage.getItem('token');
  console.log('Init socket with token:', token ? 'present' : 'missing');
  
  if (socket) {
    socket.disconnect();
  }
  
  socket = io({
    path: '/api/v1/ws',
    transports: ['websocket', 'polling'],
    auth: {
      token: token,
    },
  });
  
  return socket;
};
