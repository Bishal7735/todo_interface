import { axiosInstance } from './interpreter';
import type { Task, Category, Priority, TaskStatus } from '../types/todo';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Token Management Handlers
export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('listify_access_token');
  localStorage.removeItem('listify_refresh_token');
};

// Clean localStorage and keep ONLY accessToken & refreshToken
export const cleanLocalStorageKeepTokens = (): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const accessToken = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('listify_access_token');
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem('listify_refresh_token');

  localStorage.clear();

  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

// Immediately clean localStorage on module import to ensure only tokens remain
cleanLocalStorageKeepTokens();

// Backend Task Type Definitions
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

// Mapper Function
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

// Task API Calls
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const res: any = await axiosInstance.get('/task/getAllTask');
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
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const payload = {
    name: task.title,
    description: task.description || '',
    due_date: task.dueDate || null,
    notes: task.category || 'Work',
    priority: task.priority || 'medium',
    status: task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'In_Progress' : 'Active',
  };

  try {
    const res: any = await axiosInstance.post('/task/create', payload);
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
};

export const updateTask = async (externalId: string, updates: Partial<Task>): Promise<void> => {
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

    await axiosInstance.put(`/task/update/${externalId}`, payload);
  } catch (err) {
    console.warn('Backend updateTask failed (task updated locally):', err);
  }
};

export const deleteTask = async (externalId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/task/delete/${externalId}`);
  } catch (err) {
    console.warn('Backend deleteTask failed (task deleted locally):', err);
  }
};

export const taskApi = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  removeTokens,
  mapBackendTaskToFrontend,
};

export default taskApi;
