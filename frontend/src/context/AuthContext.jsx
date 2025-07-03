import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        console.log('[AuthProvider] Initializing. token:', token, 'savedUser:', savedUser);
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    console.log('[AuthProvider] user state changed:', user);
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      console.log('[AuthProvider] login response:', response);
      const token = response.token;
      const decodedToken = jwtDecode(token);

      // Always set roles as an array
      const roles = decodedToken.roles
        ? Array.isArray(decodedToken.roles)
          ? decodedToken.roles
          : [decodedToken.roles]
        : decodedToken.role
        ? [decodedToken.role]
        : [];

      const userData = {
        username: decodedToken.sub,
        roles,
        email: response.email,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      console.log('[AuthProvider] register response:', response);
      const token = response.token;
      const decodedToken = jwtDecode(token);

      // Always set roles as an array
      const roles = decodedToken.roles
        ? Array.isArray(decodedToken.roles)
          ? decodedToken.roles
          : [decodedToken.roles]
        : decodedToken.role
        ? [decodedToken.role]
        : [];

      const newUserData = {
        username: decodedToken.sub,
        roles,
        email: response.email,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 