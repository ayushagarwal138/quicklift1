import api, { API_PREFIX } from './axios';

export const driverAPI = {
  getAvailableTrips: async () => {
    const response = await api.get(`${API_PREFIX}/drivers/available-trips`);
    return response.data;
  },

  acceptTrip: async (tripId) => {
    const response = await api.post(`${API_PREFIX}/drivers/trips/${tripId}/accept`);
    return response.data;
  },

  startTrip: async (tripId) => {
    const response = await api.post(`${API_PREFIX}/drivers/trips/${tripId}/start`);
    return response.data;
  },

  completeTrip: async (tripId, finalFare) => {
    const response = await api.post(`${API_PREFIX}/drivers/trips/${tripId}/complete`, null, {
      params: { finalFare },
    });
    return response.data;
  },

  getMyActiveTrip: async () => {
    const response = await api.get(`${API_PREFIX}/drivers/my-active-trip`);
    return response.data;
  },

  getMyTrips: async () => {
    const response = await api.get(`${API_PREFIX}/drivers/my-trips`);
    return response.data;
  },

  setStatus: async (status) => {
    const response = await api.post(`${API_PREFIX}/drivers/set-status`, null, {
      params: { status },
    });
    return response.data;
  },

  rejectTrip: async (tripId) => {
    const response = await api.post(`${API_PREFIX}/drivers/trips/${tripId}/reject`);
    return response.data;
  },

  getOnlineDrivers: async () => {
    const response = await api.get(`${API_PREFIX}/drivers/available`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get(`${API_PREFIX}/drivers/summary`);
    return response.data;
  },
};
