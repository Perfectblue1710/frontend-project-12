import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  socket = io();

  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
  }
};