import api from './axios';

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  validateToken: async () => {
    const response = await api.get('/auth/validate');
    return response.data;
  },

  checkUsername: async (username) => {
    const response = await api.get(`/auth/check-username?username=${encodeURIComponent(username)}`);
    return response.data;
  },

  checkEmail: async (email) => {
    const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
    return response.data;
  },
}; 