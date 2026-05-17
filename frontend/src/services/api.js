import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authAPI = {
  login: (username, password) =>
    api.post('/v1/login', { username, password }),

  signup: (username, password) =>
    api.post('/v1/signup', { username, password }),
};

export const channelsAPI = {
  getChannels: () => api.get('/v1/channels'),

  createChannel: (name) =>
    api.post('/v1/channels', { name }),

  deleteChannel: (id) =>
    api.delete(`/v1/channels/${id}`),

  renameChannel: (id, name) =>
    api.patch(`/v1/channels/${id}`, { name }),
};

export const messagesAPI = {
  getMessages: () => api.get('/v1/messages'),
  sendMessage: (message) => api.post('/v1/messages', {
    body: message.body,
    channelId: message.channelId,
    username: message.username, 
  }),
};

export default api;