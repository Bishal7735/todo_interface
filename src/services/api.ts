import type { Task, User, Category, Priority, TaskStatus } from '../types/todo';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const TOKEN_KEY = 'listify_access_token';
const REFRESH_TOKEN_KEY = 'listify_refresh_token';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Attempt refresh if refresh token exists
    const refreshToken = getRefreshToken();
    if (refreshToken && endpoint !== '/auth/refresh') {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.accessToken) {
            setToken(refreshData.accessToken);
            headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
            const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              headers,
            });
            if (retryRes.ok) {
              return retryRes.json();
            }
          }
        }
      } catch (err) {
        console.warn('Token refresh failed:', err);
      }
    }
  }

  if (!response.ok) {
    let errorMessage = 'API Request Failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore json parse error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

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

export const api = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = data.accessToken || data.token;
    if (token) setToken(token);
    if (data.refreshToken) setRefreshToken(data.refreshToken);
    return data;
  },

  demoLogin: async (): Promise<AuthResponse> => {
    const demoEmail = 'bishal@listify.app';
    const demoPass = 'demo123456';
    try {
      return await api.login(demoEmail, demoPass);
    } catch (err: any) {
      try {
        return await api.register('Bishal Roy', demoEmail, demoPass, '+919876543210');
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

    const data = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        mob_number: mobileNumber || '',
      }),
    });
    const token = data.accessToken || data.token;
    if (token) setToken(token);
    if (data.refreshToken) setRefreshToken(data.refreshToken);
    return data;
  },

  getAllTasks: async (): Promise<Task[]> => {
    const backendTasks = await request<BackendTask[]>('/task/getAllTask', {
      method: 'GET',
    });
    if (!Array.isArray(backendTasks)) return [];
    return backendTasks.map(mapBackendTaskToFrontend);
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

    const res = await request<{ message: string; task: BackendTask }>('/task/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.task) {
      return mapBackendTaskToFrontend(res.task);
    }

    // Return mapped optimistic task if res.task wasn't returned explicitly
    return {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateTask: async (externalId: string, updates: Partial<Task>): Promise<void> => {
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

    await request(`/task/update/${externalId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteTask: async (externalId: string): Promise<void> => {
    await request(`/task/delete/${externalId}`, {
      method: 'DELETE',
    });
  },
};
