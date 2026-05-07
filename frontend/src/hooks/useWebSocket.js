import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { initSocket, closeSocket } from '../services/socket';
import { addMessage, setConnectionStatus } from '../slices/messagesSlice';
import { addChannel, removeChannel, renameChannelWS } from '../slices/channelsSlice';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    // ВАЖНО: подключаем WebSocket ТОЛЬКО если пользователь авторизован
    if (!isAuthenticated || !token) {
      console.log('WebSocket: not authenticated, skipping connection');
      if (socketRef.current) {
        closeSocket();
        socketRef.current = null;
      }
      return;
    }

    console.log('Initializing WebSocket for authenticated user');
    
    const socket = initSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      dispatch(setConnectionStatus(true));
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      dispatch(setConnectionStatus(false));
    });

    socket.on('newMessage', (message) => {
      console.log('📨 New message received:', message);
      dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      console.log('➕ New channel created:', channel);
      dispatch(addChannel(channel));
    });

    socket.on('removeChannel', ({ id }) => {
      console.log('🗑️ Channel removed:', id);
      dispatch(removeChannel(id));
    });

    socket.on('renameChannel', ({ id, name }) => {
      console.log('✏️ Channel renamed:', id, name);
      dispatch(renameChannelWS({ id, name }));
    });

    socket.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error);
      dispatch(setConnectionStatus(false));
    });

    return () => {
      if (socketRef.current) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('newMessage');
        socket.off('newChannel');
        socket.off('removeChannel');
        socket.off('renameChannel');
        socket.off('connect_error');
        closeSocket();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, token, dispatch]);

  return socketRef.current;
};

export default useWebSocket;
