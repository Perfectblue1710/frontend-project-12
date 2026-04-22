import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initSocket, getSocket, closeSocket } from '../services/socket';
import { addMessage, setConnectionStatus } from '../slices/messagesSlice';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsSlice';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        closeSocket();
        socketRef.current = null;
      }
      return;
    }

    // Инициализируем сокет
    const socket = initSocket(token);
    socketRef.current = socket;

    // Обработчики событий
    socket.on('connect', () => {
      console.log('WebSocket connected');
      dispatch(setConnectionStatus(true));
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      dispatch(setConnectionStatus(false));
    });

    socket.on('newMessage', (message) => {
      console.log('New message received:', message);
      dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      console.log('New channel created:', channel);
      dispatch(addChannel(channel));
    });

    socket.on('removeChannel', ({ id }) => {
      console.log('Channel removed:', id);
      dispatch(removeChannel(id));
    });

    socket.on('renameChannel', ({ id, name }) => {
      console.log('Channel renamed:', id, name);
      dispatch(renameChannel({ id, name }));
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      dispatch(setConnectionStatus(false));
    });

    // Очистка при размонтировании
    return () => {
      if (socketRef.current) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('newMessage');
        socket.off('newChannel');
        socket.off('removeChannel');
        socket.off('renameChannel');
        socket.off('connect_error');
      }
    };
  }, [isAuthenticated, token, dispatch]);

  return socketRef.current;
};

export default useWebSocket;
