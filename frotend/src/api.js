import axios from 'axios';

const API = 'http://localhost:5000'; // Change if backend runs elsewhere

export const api = axios.create({
  baseURL: API,
});

// Attach JWT to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
