import api, { API_PREFIX } from './axios';

export const userAPI = {
  getProfile: async () => {
    const response = await api.get(`${API_PREFIX}/users/me`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put(`${API_PREFIX}/users/me`, profileData);
    return response.data;
  },
  
  updateProfilePicture: async (profilePictureUrl) => {
    const response = await api.put(`${API_PREFIX}/users/me/profile-picture`, { profilePictureUrl });
    return response.data;
  },
}; 
