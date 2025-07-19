import api from './axios';

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },
  
  updateProfilePicture: async (profilePictureUrl) => {
    const response = await api.put('/api/users/profile/picture', { profilePictureUrl });
    return response.data;
  },
}; 