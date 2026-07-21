import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  removeTokens,
  cleanLocalStorageKeepTokens,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  mapBackendTaskToFrontend,
} from './task';
import type { BackendTask } from './task';

export {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  removeTokens,
  cleanLocalStorageKeepTokens,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  mapBackendTaskToFrontend,
};
export type { BackendTask };

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Create Axios Instances
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor with Automatic Token Refresh & Retry
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Don't retry infinitely
    if (
      error.response?.status === 401 &&
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
        const token = getToken();
        if (token && token.startsWith('demo-access-token')) {
          console.warn('Demo mode active - skipping redirect on auth refresh failure');
          return Promise.reject(refreshError);
        }

        removeTokens();

        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Type Definitions
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  token?: string;
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

// API Service Methods
export const apiService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res: any = await api.post('/auth/login', { email, password });
    const responseData = res?.data || res;
    const token = responseData.accessToken || responseData.token;
    if (token) setToken(token);
    if (responseData.refreshToken) setRefreshToken(responseData.refreshToken);
    return responseData;
  },

  demoLogin: async (): Promise<AuthResponse> => {
    const demoEmail = 'bishal@listify.app';
    const demoPass = 'demo123456';
    try {
      return await apiService.login(demoEmail, demoPass);
    } catch (err: any) {
      try {
        return await apiService.register('Bishal Roy', demoEmail, demoPass, '+919876543210');
      } catch (regErr: any) {
        console.warn('Backend unavailable or demo registration failed, using local demo session:', regErr);
        const fakeToken = 'demo-access-token-' + Date.now();
        setToken(fakeToken);
        return {
          accessToken: fakeToken,
          user: {
            name: 'Bishal Roy',
            email: demoEmail,
            role: 'Product Designer',
          },
        };
      }
    }
  },

  register: async (
    fullName: string,
    email: string,
    password: string,
    mobileNumber?: string
  ): Promise<AuthResponse> => {
    const nameParts = fullName.trim().split(/\s+/);
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    const res: any = await api.post('/auth/register', {
      first_name,
      last_name,
      email,
      password,
      mob_number: mobileNumber || '',
    });
    const responseData = res?.data || res;
    const token = responseData.accessToken || responseData.token;
    if (token) setToken(token);
    if (responseData.refreshToken) setRefreshToken(responseData.refreshToken);
    return responseData;
  },

  // Task API Delegation
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,

  syncFocusTime: async (date: string, minutes: number, seconds: number): Promise<void> => {
    try {
      await api.post('/focus/sync', { date, minutes, seconds });
    } catch (e) {
      console.warn('Failed to sync focus time to database:', e);
    }
  },

  getFocusTime: async (): Promise<Array<{ date: string; minutes: number; seconds: number }>> => {
    try {
      const res: any = await api.get('/focus');
      const responseData = res?.data || res;
      return Array.isArray(responseData) ? responseData : responseData?.data || [];
    } catch (e) {
      console.warn('Failed to fetch focus time from database:', e);
      return [];
    }
  },
};

export { apiService as api, api as axiosInstance };
export default apiService;
