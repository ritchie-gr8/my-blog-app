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

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 