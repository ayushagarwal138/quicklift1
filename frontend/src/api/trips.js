import api, { publicApi, API_PREFIX } from './axios';

export const updatePaymentMethod = async (tripId, paymentMethod) => {
  const response = await api.patch(`${API_PREFIX}/trips/${tripId}/payment-method`, { paymentMethod });
  return response.data;
};

export const tripsAPI = {
  bookTrip: async (tripData) => {
    const response = await api.post(`${API_PREFIX}/trips`, tripData);
    return response.data;
  },

  getMyTrips: async () => {
    const response = await api.get(`${API_PREFIX}/trips/my-trips`);
    return response.data;
  },

  getTripById: async (id) => {
    const response = await api.get(`${API_PREFIX}/trips/${id}`);
    return response.data;
  },

  cancelTrip: async (id) => {
    const response = await api.post(`${API_PREFIX}/trips/${id}/cancel`);
    return response.data;
  },

  rateTrip: async (id, rating, review) => {
    const response = await api.post(`${API_PREFIX}/trips/${id}/rating`, null, {
      params: { rating, review },
    });
    return response.data;
  },

  getTripsByStatus: async (status) => {
    const response = await api.get(`${API_PREFIX}/trips/status/${status}`);
    return response.data;
  },

  estimateFare: async (tripData) => {
    const response = await publicApi.post(`${API_PREFIX}/trips/estimate`, tripData);
    return response.data;
  },

  requestToDriver: async (tripData, driverId) => {
    const response = await api.post(`${API_PREFIX}/trips/request-to-driver`, tripData, {
      params: { driverId },
    });
    return response.data;
  },

  requestExistingTripToDriver: async (tripId, driverId) => {
    const response = await api.post(`${API_PREFIX}/trips/${tripId}/request-driver`, null, {
      params: { driverId },
    });
    return response.data;
  },

  payForTrip: async (tripId, method = 'CASH') => {
    const response = await api.post(`${API_PREFIX}/payments`, {
      tripId,
      method,
      idempotencyKey: `trip-${tripId}-${method}`,
    });
    return response.data;
  },

  updatePaymentMethod,
};
