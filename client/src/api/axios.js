import axios from 'axios';
import { apiUrl } from '@/constants/urls';

const api = axios.create({
  baseURL: apiUrl
});

api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    const { token } = JSON.parse(userData);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
