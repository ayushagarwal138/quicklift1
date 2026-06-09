import api, { publicApi, API_PREFIX } from './axios';

export const authAPI = {
  login: async (credentials) => {
    const response = await publicApi.post(`${API_PREFIX}/auth/login`, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await publicApi.post(`${API_PREFIX}/auth/register`, userData);
    return response.data;
  },

  refresh: async () => {
    const response = await publicApi.post(`${API_PREFIX}/auth/refresh`);
    return response.data;
  },

  logout: async () => {
    await api.post(`${API_PREFIX}/auth/logout`);
  },

  me: async () => {
    const response = await api.get(`${API_PREFIX}/auth/me`);
    return response.data;
  },

  validateToken: async () => {
    const response = await api.get(`${API_PREFIX}/auth/validate`);
    return response.data;
  },

  checkUsername: async (username) => {
    const response = await publicApi.get(`${API_PREFIX}/auth/check-username`, {
      params: { username },
    });
    return response.data;
  },

  checkEmail: async (email) => {
    const response = await publicApi.get(`${API_PREFIX}/auth/check-email`, {
      params: { email },
    });
    return response.data;
  },

  googleStartUrl: () => `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')}${API_PREFIX}/auth/oauth2/google/start`,
};
