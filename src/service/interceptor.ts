// ==========================================
// AXIOS INTERCEPTOR SERVICE (Frontend)
// This file configures HTTP requests sent to the backend server.
// It automatically attaches JWT access tokens to requests and
// handles automatic token refreshing when an access token expires.
// ==========================================

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getToken,
  setToken,
  getRefreshToken,
  removeTokens,
} from './auth';

// Base backend URL from environment variables or fallback to port 4000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Main Axios instance used for protected API calls
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dedicated Axios instance for refreshing tokens (avoids infinite interceptor loops)
export const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------------------------------
// REQUEST INTERCEPTOR
// Automatically attaches Bearer JWT access token to every outgoing request header
// ------------------------------------------
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ------------------------------------------
// RESPONSE INTERCEPTOR
// Handles 401 Unauthorized errors and automatically refreshes access token
// ------------------------------------------
api.interceptors.response.use(
  // Automatically unpack response data on successful API response
  (response) => response.data,

  // Error handling logic
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const requestUrl = originalRequest?.url || '';

    // Check if the failed request was an authentication request (login, register, refresh)
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh');

    // If server returned 401 (token expired) and request is NOT a login/register/refresh endpoint
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Request a new access token using the stored refresh token
        const response: any = await refreshApi.post('/auth/refresh', {
          refreshToken,
        });

        const responseData = response?.data || response;
        const newAccessToken = responseData.accessToken || responseData.token;

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh endpoint');
        }

        // Save new access token to localStorage
        setToken(newAccessToken);

        // Attach new access token to the failed original request header and retry it
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token is expired or invalid, log out the user safely
        removeTokens();

        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/' &&
          window.location.pathname !== '/login'
        ) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Return all other error responses directly to the caller
    return Promise.reject(error);
  }
);

// Export aliases for backward compatibility across components
export { api as axiosInstance };
export default api;
