// ==========================================
// TASK SERVICE & DATABASE API METHODS (Frontend)
// This file handles task CRUD operations (Get, Create, Update, Delete)
// and maps database models to React component task structures.
// ==========================================

import { axiosInstance } from './interceptor';
import type { Task, Category, Priority, TaskStatus } from '../types/todo';

// Backend Task Database Model Interface
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

/**
 * Mapper Function:
 * Converts raw database task object returned by Sequelize ORM backend
 * into clean React state Task object used by frontend components.
 */
export function mapBackendTaskToFrontend(bt: BackendTask): Task {
  const id = bt.external_id || String(bt.id);
  const title = bt.name || 'Untitled Task';
  const description = bt.description || '';

  // Validate category string
  let category: Category = 'Work';
  const rawCategory = bt.notes || bt.category || 'Work';
  const validCategories: Category[] = ['Work', 'Personal', 'Design', 'Development', 'Health', 'Finance'];
  if (validCategories.includes(rawCategory as Category)) {
    category = rawCategory as Category;
  }

  // Validate priority level
  let priority: Priority = 'medium';
  const rawPriority = (bt.priority || 'medium').toLowerCase();
  if (['low', 'medium', 'high', 'urgent'].includes(rawPriority)) {
    priority = rawPriority as Priority;
  }

  // Map database status string to frontend task status
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

// ------------------------------------------
// TASK API CALLS
// ------------------------------------------

/**
 * Fetch all tasks created by the logged-in user from backend database.
 */
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const res: any = await axiosInstance.get('/task/getAllTask');
    let backendTasks: any[] = [];

    // Safely extract task array from various response formats
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

/**
 * Create a new task in backend database.
 */
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

  // Fallback local task object if offline or database error occurs
  return {
    id: Date.now().toString(),
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Update an existing task in backend database.
 */
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

/**
 * Delete a task by ID from backend database.
 */
export const deleteTask = async (externalId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/task/delete/${externalId}`);
  } catch (err) {
    console.warn('Backend deleteTask failed (task deleted locally):', err);
  }
};

/**
 * Sync focus tracking duration to backend database.
 */
export const syncFocusTime = async (date: string, minutes: number, seconds: number): Promise<void> => {
  try {
    await axiosInstance.post('/focus/sync', { date, minutes, seconds });
  } catch (e) {
    console.warn('Failed to sync focus time to database:', e);
  }
};

/**
 * Fetch focus tracking stats history from backend database.
 */
export const getFocusTime = async (): Promise<Array<{ date: string; minutes: number; seconds: number }>> => {
  try {
    const res: any = await axiosInstance.get('/focus');
    const responseData = res?.data || res;
    return Array.isArray(responseData) ? responseData : responseData?.data || [];
  } catch (e) {
    console.warn('Failed to fetch focus time from database:', e);
    return [];
  }
};

export const taskService = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  syncFocusTime,
  getFocusTime,
  mapBackendTaskToFrontend,
};

export default taskService;
