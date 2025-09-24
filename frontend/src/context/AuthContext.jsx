import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/auth';
import {
  clearAccessToken,
  forgetAuthSession,
  hasRememberedAuthSession,
  rememberAuthSession,
  setAccessToken,
} from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const normalizeUser = (data) => {
  const roles = (data?.roles || []).map(r => r.replace(/^ROLE_/, ''));
  return {
    id: data?.id,
    driverId: data?.driverId,
    username: data?.username,
    email: data?.email,
    firstName: data?.firstName,
    lastName: data?.lastName,
    roles,
    role: roles[0],
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const oauthToken = hashParams.get('accessToken');
        if (oauthToken) {
          setAccessToken(oauthToken);
          rememberAuthSession();
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else if (hasRememberedAuthSession()) {
          const refreshResponse = await authAPI.refresh();
          setAccessToken(refreshResponse.accessToken || refreshResponse.token);
          rememberAuthSession();
        }

        if (oauthToken || hasRememberedAuthSession()) {
          const me = await authAPI.me();
          setUser(normalizeUser(me));
        }
      } catch {
        clearAccessToken();
        forgetAuthSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      setAccessToken(response.accessToken || response.token);
      rememberAuthSession();
      setUser(normalizeUser(response));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      setAccessToken(response.accessToken || response.token);
      rememberAuthSession();
      setUser(normalizeUser(response));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Logout should clear local state even if the network request fails.
    } finally {
      clearAccessToken();
      forgetAuthSession();
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
