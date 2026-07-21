export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  mobileNumber?: string;
  avatarInitials?: string;
};

export type Category = 'Work' | 'Personal' | 'Design' | 'Development' | 'Health' | 'Finance';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  status: TaskStatus;
  dueDate: string;
  estimatedMinutes?: number;
  subtasks: Subtask[];
  pinned?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'grid' | 'list';

export type SortBy = 'dueDate' | 'priority' | 'title' | 'createdAt';

export interface FilterState {
  search: string;
  category: Category | 'All';
  priority: Priority | 'All';
  status: TaskStatus | 'All';
  viewMode: ViewMode;
  sortBy: SortBy;
}

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  urgent: number;
  completionPercentage: number;
}

export type NavSection = 'dashboard' | 'tasks' | 'analytics' | 'settings';
