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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Create Axios Instances
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer access token to every outgoing request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor: Handle 401 Unauthorized & perform token refresh retry
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Don't retry infinitely or for refresh endpoint itself
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response: any = await refreshApi.post('/auth/refresh', {
          refreshToken,
        });

        const responseData = response?.data || response;
        const newAccessToken = responseData.accessToken || responseData.token;

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh endpoint');
        }

        setToken(newAccessToken);

        // Update header for retried request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
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

    return Promise.reject(error);
  }
);

export { api as axiosInstance };
export default api;
