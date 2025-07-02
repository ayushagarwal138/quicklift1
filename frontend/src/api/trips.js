import api from './axios';
const API_BASE_URL = 'http://localhost:8080/api';

export const updatePaymentMethod = async (tripId, paymentMethod) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}/payment-method`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ paymentMethod }),
  });
  if (!response.ok) {
    throw new Error('Failed to update payment method');
  }
  return await response.json();
};

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

  payForTrip: async (tripId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/pay`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Payment failed');
    }
    return await response.json();
  },

  updatePaymentMethod,
}; 