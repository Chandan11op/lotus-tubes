import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService, { getStoredToken, getStoredUser, clearAuthData } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally refresh profile if token exists
    if (token && !user) {
      apiService.getMe()
        .then((res) => {
          if (res?.data?.user) {
            setUser(res.data.user);
          }
        })
        .catch(() => {
          clearAuthData();
          setUser(null);
          setToken(null);
        });
    }
  }, [token]);

  const loginCustomer = async (credentials) => {
    setLoading(true);
    try {
      const res = await apiService.loginCustomer(credentials);
      const u = res?.data?.user || res?.user;
      const t = res?.data?.token || res?.token;
      setUser(u);
      setToken(t);
      return { success: true, user: u, token: t, data: res?.data };
    } finally {
      setLoading(false);
    }
  };

  const registerCustomer = async (customerData) => {
    setLoading(true);
    try {
      const res = await apiService.registerCustomer(customerData);
      const u = res?.data?.user || res?.user;
      const t = res?.data?.token || res?.token;
      setUser(u);
      setToken(t);
      return { success: true, user: u, token: t, data: res?.data };
    } finally {
      setLoading(false);
    }
  };

  const loginStaff = async (credentials) => {
    setLoading(true);
    try {
      const res = await apiService.loginStaff(credentials);
      const u = res?.data?.user || res?.user;
      const t = res?.data?.token || res?.token;
      setUser(u);
      setToken(t);
      return { success: true, user: u, token: t, data: res?.data };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoggedIn: !!user,
    isCustomer: user?.role === 'customer',
    isStaff: user?.role === 'staff' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    loading,
    loginCustomer,
    registerCustomer,
    loginStaff,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
