import { createContext, useState, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const getInitialUser = () => {
  try {
    if (typeof window !== 'undefined') {
      // Try sessionStorage first (no restrictions), fallback to localStorage
      const storage = window.sessionStorage || window.localStorage;
      const token = storage.getItem('token');
      const savedUser = storage.getItem('user');

      if (token && savedUser) {
        return JSON.parse(savedUser);
      }
    }
  } catch (error) {
    console.warn('Storage not available on initial load:', error);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [loading] = useState(false);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, ...userData } = response.data;

      // Use sessionStorage (no restrictions) instead of localStorage
      try {
        if (typeof window !== 'undefined') {
          const storage = window.sessionStorage || window.localStorage;
          storage.setItem('token', token);
          storage.setItem('user', JSON.stringify(userData));
        }
      } catch (storageError) {
        console.warn('Storage not available:', storageError);
        // Continue anyway - user will be set in memory
      }

      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        const storage = window.sessionStorage || window.localStorage;
        storage.removeItem('token');
        storage.removeItem('user');
      }
    } catch (error) {
      console.warn('Storage not available during logout:', error);
    }
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};