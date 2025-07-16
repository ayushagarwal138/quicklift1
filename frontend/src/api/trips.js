import api from './axios';
import { publicApi } from './api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    const response = await api.post('/api/trips/book', tripData);
    return response.data;
  },

  getMyTrips: async () => {
    const response = await api.get('/api/trips/my-trips');
    return response.data;
  },

  getTripById: async (id) => {
    const response = await api.get(`/api/trips/${id}`);
    return response.data;
  },

  cancelTrip: async (id) => {
    const response = await api.post(`/api/trips/${id}/cancel`);
    return response.data;
  },

  rateTrip: async (id, rating, review) => {
    const response = await api.post(`/api/trips/${id}/rate`, { rating, review });
    return response.data;
  },

  getTripsByStatus: async (status) => {
    const response = await api.get(`/api/trips/status/${status}`);
    return response.data;
  },

  estimateFare: async (tripData) => {
    const response = await publicApi.post('/api/trips/estimate', tripData);
    return response.data;
  },

  requestToDriver: async (tripData, driverId) => {
    const response = await api.post(`/api/trips/request-to-driver?driverId=${driverId}`, tripData);
    return response.data;
  },

  payForTrip: async (tripId) => {
    const token = localStorage.getItem('token');
    // Ensure no double slash in URL and add /api prefix
    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/api/trips/${tripId}/pay`, {
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