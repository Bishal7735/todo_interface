import api, { axiosInstance } from './interceptor';
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  removeTokens,
  cleanLegacyKeys,
  isSessionTokenExpired,
  isRefreshTokenExpired,
  SESSION_TOKEN_LIFESPAN,
  REFRESH_TOKEN_LIFESPAN,
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
  cleanLegacyKeys,
  isSessionTokenExpired,
  isRefreshTokenExpired,
  SESSION_TOKEN_LIFESPAN,
  REFRESH_TOKEN_LIFESPAN,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  mapBackendTaskToFrontend,
};
export type { BackendTask };

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
