// ==========================================
// TASKS SECTION COMPONENT (React)
// This component renders the full "My Tasks" section page in the workspace.
// It includes page title headers, task action buttons, category/status filters,
// and the main task list container (grid or 2-column list view).
// ==========================================

import React from 'react';
import type { Task, FilterState } from '../types/todo';
import { TaskFilter, TaskList } from './Dashboard';
import { CheckSquare, Plus } from 'lucide-react';

export interface TasksProps {
  tasks: Task[];
  filteredTasks: Task[];
  totalTasks: number;
  filter: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onOpenNewTaskModal: () => void;
}

export const Tasks: React.FC<TasksProps> = ({
  tasks,
  filteredTasks,
  totalTasks,
  filter,
  onUpdateFilter,
  onToggleComplete,
  onTogglePin,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
  onOpenNewTaskModal,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Tasks Page Title & Create Button Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <CheckSquare size={26} color="var(--accent-purple)" />
            <span>My Tasks & Workspace Roadmap</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Manage, filter, and track all your actionable tasks, subtasks, and project items.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, background: 'var(--bg-card)', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            Showing {filteredTasks.length} of {totalTasks} tasks
          </span>
          <button className="btn-primary" onClick={onOpenNewTaskModal} style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}>
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Category, Status, Priority & View Mode Filter Toolbar */}
      <TaskFilter filter={filter} onUpdateFilter={onUpdateFilter} />

      {/* Main Task List Grid & Cards Container */}
      <TaskList
        tasks={filteredTasks}
        viewMode={filter.viewMode}
        onToggleComplete={onToggleComplete}
        onTogglePin={onTogglePin}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onToggleSubtask={onToggleSubtask}
        onOpenNewTaskModal={onOpenNewTaskModal}
      />
    </div>
  );
};

export default Tasks;
