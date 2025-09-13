import { getAccessToken } from './axios';

export const getAuthenticatedWsUrl = () => {
  const baseUrl = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080/ws';
  const token = getAccessToken();
  if (!token) {
    return baseUrl;
  }
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}access_token=${encodeURIComponent(token)}`;
};

export const getStompConnectHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
