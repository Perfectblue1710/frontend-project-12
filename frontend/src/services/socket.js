import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  socket = io({
    auth: {
      token: `Bearer ${token}`,
    },
  });

  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};