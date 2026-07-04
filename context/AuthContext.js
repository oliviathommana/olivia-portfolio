'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminSession = localStorage.getItem('olivia_admin_session');
    if (adminSession === 'active') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (password) => {
    const cleanPassword = password?.trim();
    if (cleanPassword === 'enter your password here' || cleanPassword === 'enter you password here') {
      localStorage.setItem('olivia_admin_session', 'active');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('olivia_admin_session');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
