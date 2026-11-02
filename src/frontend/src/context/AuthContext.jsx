import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, {
  getToken,
  setToken,
  setRefreshToken,
  removeToken,
  getStoredUser,
  setStoredUser,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [wallet, setWallet] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);

  const refreshWallet = useCallback(async () => {
    if (!getToken()) return null;
    try {
      const walletData = await api.getWallet();
      setWallet(walletData);
      return walletData;
    } catch (err) {
      console.warn('Failed to fetch wallet:', err.message);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getToken()) return null;
    try {
      const userData = await api.getMe();
      setUser(userData);
      setStoredUser(userData);
      return userData;
    } catch (err) {
      console.warn('Failed to fetch user:', err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (getToken()) {
        await Promise.all([refreshUser(), refreshWallet()]);
      }
      setLoading(false);
    };
    init();
  }, [refreshUser, refreshWallet]);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    const tokenStr = response.access_token || response.token;
    if (tokenStr) {
      setToken(tokenStr);
      setTokenState(tokenStr);
    }
    if (response.refresh_token) {
      setRefreshToken(response.refresh_token);
    }
    if (response.user) {
      setUser(response.user);
      setStoredUser(response.user);
    }
    await Promise.all([refreshUser(), refreshWallet()]);
    return response;
  };

  const signup = async (userData) => {
    const response = await api.signup(userData);
    const tokenStr = response.access_token || response.token;
    if (tokenStr) {
      setToken(tokenStr);
      setTokenState(tokenStr);
    }
    if (response.refresh_token) {
      setRefreshToken(response.refresh_token);
    }
    if (response.user) {
      setUser(response.user);
      setStoredUser(response.user);
    }
    await Promise.all([refreshUser(), refreshWallet()]);
    return response;
  };

  const logout = async (allDevices = false) => {
    try {
      await api.logout(allDevices);
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      removeToken();
      setTokenState(null);
      setUser(null);
      setWallet(null);
    }
  };

  const value = {
    user,
    wallet,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    signup,
    logout,
    refreshWallet,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
