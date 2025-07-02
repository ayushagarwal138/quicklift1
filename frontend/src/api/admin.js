import api from './axios';

export const adminAPI = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getAllDrivers: async () => {
    const response = await api.get('/admin/drivers');
    return response.data;
  },

  getAllTrips: async () => {
    const response = await api.get('/admin/trips');
    return response.data;
  },
}; 