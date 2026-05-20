import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
})
export const authAPI = {
  login: (username, password) => api.post('/v1/login', { username, password }),
  signup: (username, password) =>
    api.post('/v1/signup', { username, password }),
}

export default api

