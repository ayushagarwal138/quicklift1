import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
export const API_PREFIX = '/api/v1';
const AUTH_SESSION_STORAGE_KEY = 'quicklift:auth-session';

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const rememberAuthSession = () => {
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, 'true');
};

export const hasRememberedAuthSession = () => (
  window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY) === 'true'
);

export const forgetAuthSession = () => {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      try {
        refreshPromise ||= publicApi.post(`${API_PREFIX}/auth/refresh`);
        const refreshResponse = await refreshPromise;
        refreshPromise = null;
        const token = refreshResponse.data.accessToken || refreshResponse.data.token;
        setAccessToken(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        clearAccessToken();
        forgetAuthSession();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
