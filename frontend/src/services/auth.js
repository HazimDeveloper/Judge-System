import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/api/token/', { username, password });
  if (response.data.access) {
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/api/users/register/', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me/');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh');
}; 