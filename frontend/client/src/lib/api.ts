import axios from 'axios';

// Use relative URL to hit the Express proxy on the same origin
const API_BASE_URL = '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔍 API Request Debug:', {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
    fullUrl: `${config.baseURL ?? ''}${config.url ?? ''}`,
    timestamp: new Date().toISOString()
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Added Authorization header to', config.url);
  } else {
    console.log('❌ No token found in localStorage for', config.url);
    console.log('❌ Current localStorage token:', localStorage.getItem('token'));
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      
      if (status === 403) {
        throw new Error("You don't have permission to perform this action");
      } else if (status === 409) {
        throw new Error(message || 'Conflict - resource already exists or unavailable');
      } else if (status === 400) {
        throw new Error(message || 'Validation error');
      } else if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again');
      }
    }
    throw error;
  }
);

export default api;
