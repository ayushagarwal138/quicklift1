import api from './axios';

export const driverAPI = {
  getAvailableTrips: async () => {
    const response = await api.get('/driver/available-trips');
    return response.data;
  },

  acceptTrip: async (tripId) => {
    const response = await api.post(`/driver/trips/${tripId}/accept`);
    return response.data;
  },

  startTrip: async (tripId) => {
    const response = await api.post(`/driver/trips/${tripId}/start`);
    return response.data;
  },

  completeTrip: async (tripId, finalFare) => {
    const response = await api.post(`/driver/trips/${tripId}/complete`, null, {
      params: { finalFare }
    });
    return response.data;
  },

  getMyActiveTrip: async () => {
    const response = await api.get('/driver/my-active-trip');
    return response.data;
  },

  getMyTrips: async () => {
    const response = await api.get('/driver/my-trips');
    return response.data;
  },

  setStatus: async (status) => {
    const response = await api.post(`/driver/set-status?status=${status}`);
    return response.data;
  },

  rejectTrip: async (tripId) => {
    const response = await api.post(`/driver/trips/${tripId}/reject`);
    return response.data;
  },

  getOnlineDrivers: async () => {
    const response = await api.get('/driver/online');
    return response.data;
  },
}; 