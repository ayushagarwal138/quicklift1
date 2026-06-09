import api, { API_PREFIX } from './axios';

export const adminAPI = {
  getAllUsers: async () => {
    const response = await api.get(`${API_PREFIX}/admin/users`);
    return response.data;
  },

  getAllDrivers: async () => {
    const response = await api.get(`${API_PREFIX}/admin/drivers`);
    return response.data;
  },

  getAllTrips: async () => {
    const response = await api.get(`${API_PREFIX}/admin/trips`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`${API_PREFIX}/users/${userId}`);
    return response.data;
  },

  deleteDriver: async (driverId) => {
    const response = await api.delete(`${API_PREFIX}/admin/drivers/${driverId}`);
    return response.data;
  },
}; 
