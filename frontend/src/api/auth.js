import api from './axios';
import { publicApi } from './api';

export const authAPI = {
  login: async (credentials) => {
    const response = await publicApi.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await publicApi.post('/api/auth/register', userData);
    return response.data;
  },

  validateToken: async () => {
    const response = await api.get('/api/auth/validate');
    return response.data;
  },

  checkUsername: async (username) => {
    const response = await publicApi.get(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    return response.data;
  },

  checkEmail: async (email) => {
    const response = await publicApi.get(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    return response.data;
  },
}; 