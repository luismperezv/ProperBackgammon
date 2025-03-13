import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import tokenService from './tokenService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't override Content-Type if it's already set in the request
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      // Keep the content type for form data
      return config;
    }
    
    if (!config.headers['Content-Type'] && config.data instanceof FormData) {
      delete config.headers['Content-Type']; // Let axios set the correct boundary
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or we don't have a config, reject immediately
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if ((originalRequest as any)._retry) {
      tokenService.removeToken(); // Clear invalid tokens
      window.location.href = '/auth'; // Redirect to login
      return Promise.reject(error);
    }

    try {
      (originalRequest as any)._retry = true;

      // Try to refresh the token
      const response = await api.post('/auth/refresh');
      const { access_token } = response.data;
      
      // Store the new token
      tokenService.setToken(access_token);
      
      // Update the failed request with new token and retry
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }
      
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear tokens and redirect to login
      tokenService.removeToken();
      window.location.href = '/auth';
      return Promise.reject(refreshError);
    }
  }
);

export default api; 