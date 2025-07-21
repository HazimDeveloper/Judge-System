import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as apiLogout } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
      } finally {
        setLoading(false);
      }
    };
    if (localStorage.getItem('token')) {
      if (!user) {
        fetchUser();
      } else {
        setLoading(false);
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 