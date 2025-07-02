import api from './axios';

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  updateProfilePicture: async (profilePictureUrl) => {
    const response = await api.put('/users/profile/picture', { profilePictureUrl });
    return response.data;
  },
}; 