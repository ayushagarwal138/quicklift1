import { publicApi, API_PREFIX } from './api';

export const citiesAPI = {
  // Search cities by query
  searchCities: async (query) => {
    try {
      const response = await publicApi.get(`${API_PREFIX}/cities/search`, { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
    }
  },

  // Get all states
  getAllStates: async () => {
    try {
      const response = await publicApi.get(`${API_PREFIX}/cities/states`);
      return response.data;
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error;
    }
  },

  // Get cities by state
  getCitiesByState: async (state) => {
    try {
      const response = await publicApi.get(`${API_PREFIX}/cities/state/${encodeURIComponent(state)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities by state:', error);
      throw error;
    }
  },

  // Get all cities
  getAllCities: async () => {
    try {
      const response = await publicApi.get(`${API_PREFIX}/cities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all cities:', error);
      throw error;
    }
  },

  // Get popular cities
  getPopularCities: async () => {
    try {
      const response = await publicApi.get(`${API_PREFIX}/cities/popular`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular cities:', error);
      throw error;
    }
  }
}; 
