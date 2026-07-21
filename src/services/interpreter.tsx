import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import type { Task, Category, Priority, TaskStatus } from '../types/todo';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Token Management Utilities
export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY) || localStorage.getItem('listify_access_token');

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('listify_access_token', token);
};

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem('listify_refresh_token');

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
  localStorage.setItem('listify_refresh_token', token);
};

export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('listify_access_token');
  localStorage.removeItem('listify_refresh_token');
};

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

export interface BackendTask {
  id: number | string;
  external_id: string;
  name: string;
  description?: string;
  notes?: string;
  category?: string;
  due_date?: string | null;
  status: string;
  priority: string;
  createdAt?: string;
  updatedAt?: string;
}

export function mapBackendTaskToFrontend(bt: BackendTask): Task {
  const id = bt.external_id || String(bt.id);
  const title = bt.name || 'Untitled Task';
  const description = bt.description || '';

  let category: Category = 'Work';
  const rawCategory = bt.notes || bt.category || 'Work';
  const validCategories: Category[] = ['Work', 'Personal', 'Design', 'Development', 'Health', 'Finance'];
  if (validCategories.includes(rawCategory as Category)) {
    category = rawCategory as Category;
  }

  let priority: Priority = 'medium';
  const rawPriority = (bt.priority || 'medium').toLowerCase();
  if (['low', 'medium', 'high', 'urgent'].includes(rawPriority)) {
    priority = rawPriority as Priority;
  }

  let status: TaskStatus = 'todo';
  const rawStatus = (bt.status || 'Active').toLowerCase();
  if (rawStatus === 'completed' || rawStatus === 'done') {
    status = 'completed';
  } else if (rawStatus === 'in_progress' || rawStatus === 'progress') {
    status = 'in_progress';
  } else {
    status = 'todo';
  }

  return {
    id,
    title,
    description,
    category,
    priority,
    status,
    dueDate: bt.due_date ? String(bt.due_date).split('T')[0] : '',
    subtasks: [],
    tags: [],
    createdAt: bt.createdAt || new Date().toISOString(),
    updatedAt: bt.updatedAt || new Date().toISOString(),
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

  getAllTasks: async (): Promise<Task[]> => {
    try {
      const res: any = await api.get('/task/getAllTask');
      let backendTasks: any[] = [];

      if (Array.isArray(res)) {
        backendTasks = res;
      } else if (res && Array.isArray(res.data)) {
        backendTasks = res.data;
      } else if (res && Array.isArray(res.tasks)) {
        backendTasks = res.tasks;
      } else if (res && res.data && Array.isArray(res.data.tasks)) {
        backendTasks = res.data.tasks;
      }

      if (!Array.isArray(backendTasks)) return [];
      return backendTasks.map(mapBackendTaskToFrontend);
    } catch (err) {
      console.warn('getAllTasks API error:', err);
      return [];
    }
  },

  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const payload = {
      name: task.title,
      description: task.description || '',
      due_date: task.dueDate || null,
      notes: task.category || 'Work',
      priority: task.priority || 'medium',
      status: task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'In_Progress' : 'Active',
    };

    try {
      const res: any = await api.post('/task/create', payload);
      const responseData = res?.data !== undefined && !res.task ? res.data : res;

      if (responseData && (responseData.task || responseData.id)) {
        const backendTaskObj = responseData.task || responseData;
        return mapBackendTaskToFrontend(backendTaskObj);
      }
    } catch (err) {
      console.warn('Backend createTask failed, using local task fallback:', err);
    }

    return {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateTask: async (externalId: string, updates: Partial<Task>): Promise<void> => {
    try {
      const payload: Record<string, any> = {};
      if (updates.title !== undefined) payload.name = updates.title;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.dueDate !== undefined) payload.due_date = updates.dueDate || null;
      if (updates.category !== undefined) payload.notes = updates.category;
      if (updates.priority !== undefined) payload.priority = updates.priority;
      if (updates.status !== undefined) {
        payload.status = updates.status === 'completed' ? 'Completed' : updates.status === 'in_progress' ? 'In_Progress' : 'Active';
        payload.completed = updates.status === 'completed';
      }

      await api.put(`/task/update/${externalId}`, payload);
    } catch (err) {
      console.warn('Backend updateTask failed (task updated locally):', err);
    }
  },

  deleteTask: async (externalId: string): Promise<void> => {
    try {
      await api.delete(`/task/delete/${externalId}`);
    } catch (err) {
      console.warn('Backend deleteTask failed (task deleted locally):', err);
    }
  },

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
