import api from './axios';

export const tripsAPI = {
  bookTrip: async (tripData) => {
    const response = await api.post('/trips/book', tripData);
    return response.data;
  },

  getMyTrips: async () => {
    const response = await api.get('/trips/my-trips');
    return response.data;
  },

  getTripById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  cancelTrip: async (id) => {
    const response = await api.post(`/trips/${id}/cancel`);
    return response.data;
  },

  rateTrip: async (id, rating, review) => {
    const response = await api.post(`/trips/${id}/rate`, { rating, review });
    return response.data;
  },

  getTripsByStatus: async (status) => {
    const response = await api.get(`/trips/status/${status}`);
    return response.data;
  },

  estimateFare: async (tripData) => {
    const response = await api.post('/trips/estimate', tripData);
    return response.data;
  },

  requestToDriver: async (tripData, driverId) => {
    const response = await api.post(`/trips/request-to-driver?driverId=${driverId}`, tripData);
    return response.data;
  },
}; 