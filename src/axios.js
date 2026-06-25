// src/axios.js
import axios from 'axios';

const BACKEND_IP = '192.168.1.10:8000';
const apiClient = axios.create({
  baseURL: `http://${BACKEND_IP}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;