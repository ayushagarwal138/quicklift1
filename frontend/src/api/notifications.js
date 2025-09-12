import api, { API_PREFIX } from './axios';

export const notificationsAPI = {
  list: async () => {
    const response = await api.get(`${API_PREFIX}/notifications`);
    return response.data;
  },

  unreadCount: async () => {
    const response = await api.get(`${API_PREFIX}/notifications/unread-count`);
    return response.data;
  },

  markRead: async (id) => {
    const response = await api.patch(`${API_PREFIX}/notifications/${id}/read`);
    return response.data;
  },

  markAllRead: async () => {
    const response = await api.patch(`${API_PREFIX}/notifications/read-all`);
    return response.data;
  },
};
