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

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  deleteDriver: async (driverId) => {
    const response = await api.delete(`/admin/drivers/${driverId}`);
    return response.data;
  },
}; 