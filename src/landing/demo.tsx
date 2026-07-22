import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Chip } from '@mui/material';
import {
  Sparkles,
  Plus,
  Trash2,
  Flame,
  Zap,
  Leaf,
  RotateCcw,
  Check
} from 'lucide-react';

export interface DemoTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

const SESSION_TASKS_KEY = 'listify_demo_tasks';
const SESSION_COUNT_KEY = 'listify_demo_task_count';
const TASK_LIMIT = 5;

const INITIAL_DEMO_TASKS: DemoTask[] = [
  {
    id: 'demo-1',
    title: '⚡ Test ListiFy 2.0 interactive preview in your browser',
    completed: true,
    priority: 'high',
    createdAt: 'Just now'
  },
  {
    id: 'demo-2',
    title: '🎯 Try adding 3 more tasks to experience instant task creation',
    completed: false,
    priority: 'medium',
    createdAt: 'Just now'
  }
];

const DEMO_STYLES = `
.demo-interactive-section {
  padding: 80px 0;
  position: relative;
  z-index: 2;
  background: radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.08) 0%, rgba(5, 7, 19, 0) 70%);
}

.demo-glass-container {
  background: rgba(13, 18, 36, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 28px;
  padding: 36px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 92, 246, 0.15);
  position: relative;
  overflow: hidden;
}

.demo-glass-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4, #10B981);
}

.demo-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.demo-input-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.demo-text-input {
  flex: 1;
  min-width: 240px;
  background: rgba(10, 14, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 14px 20px;
  color: #F8FAFC;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  transition: all 0.25s ease;
}

.demo-text-input:focus {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
  background: rgba(15, 22, 42, 0.9);
}

.priority-btn-group {
  display: flex;
  gap: 6px;
  background: rgba(10, 14, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 16px;
}

.priority-chip-btn {
  background: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 12px;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.priority-chip-btn.active-high {
  background: rgba(244, 63, 94, 0.2);
  color: #FB7185;
  border: 1px solid rgba(244, 63, 94, 0.4);
}

.priority-chip-btn.active-medium {
  background: rgba(6, 182, 212, 0.2);
  color: #38BDF8;
  border: 1px solid rgba(6, 182, 212, 0.4);
}

.priority-chip-btn.active-low {
  background: rgba(16, 185, 129, 0.2);
  color: #34D399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.btn-add-demo-task {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-add-demo-task:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.5);
}

.btn-add-demo-task:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #334155;
  box-shadow: none;
}

.demo-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 4px;
}

.demo-task-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.25s ease;
}

.demo-task-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
  background: rgba(20, 30, 55, 0.7);
  transform: translateX(4px);
}

.demo-task-card.completed {
  opacity: 0.65;
  background: rgba(10, 14, 26, 0.4);
}

.demo-checkbox-btn {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #FFFFFF;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.demo-checkbox-btn.checked {
  background: linear-gradient(135deg, #10B981, #059669);
  border-color: #10B981;
}

.demo-task-title {
  font-size: 15px;
  color: #F1F5F9;
  font-weight: 500;
  transition: text-decoration 0.2s ease;
}

.demo-task-title.strike {
  text-decoration: line-through;
  color: #64748B;
}

.demo-delete-btn {
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.demo-delete-btn:hover {
  color: #EF4444;
  background: rgba(239, 68, 68, 0.15);
}
`;

export const Demo: React.FC = () => {
  const navigate = useNavigate();

  // Load initial tasks from sessionStorage or default
  const [tasks, setTasks] = useState<DemoTask[]>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_TASKS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading demo tasks from sessionStorage:', e);
    }
    return INITIAL_DEMO_TASKS;
  });

  // Load task count from sessionStorage or default (2)
  const [taskCount, setTaskCount] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_COUNT_KEY);
      if (saved !== null) {
        return parseInt(saved, 10);
      }
    } catch (e) {
      console.error('Error reading task count from sessionStorage:', e);
    }
    return 2;
  });

  const [newTitle, setNewTitle] = useState<string>('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Sync tasks and count to sessionStorage whenever updated
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_TASKS_KEY, JSON.stringify(tasks));
      sessionStorage.setItem(SESSION_COUNT_KEY, taskCount.toString());
    } catch (e) {
      console.error('Error syncing tasks to sessionStorage:', e);
    }
  }, [tasks, taskCount]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: DemoTask = {
      id: `demo-${Date.now()}`,
      title: newTitle.trim(),
      completed: false,
      priority,
      createdAt: 'Just now'
    };

    const nextTasks = [newTask, ...tasks];
    const nextCount = taskCount + 1;

    setTasks(nextTasks);
    setTaskCount(nextCount);
    setNewTitle('');

    // Immediate sync to sessionStorage
    try {
      sessionStorage.setItem(SESSION_TASKS_KEY, JSON.stringify(nextTasks));
      sessionStorage.setItem(SESSION_COUNT_KEY, nextCount.toString());
    } catch (err) {
      console.error('Error saving to sessionStorage:', err);
    }

    // Redirect to register immediately after 5 tasks are created
    if (nextCount >= TASK_LIMIT) {
      navigate('/register');
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <section className="demo-interactive-section" id="demo">
      <style>{DEMO_STYLES}</style>

      <Container maxWidth="lg">
        {/* Section Header */}
        <div className="section-header-center" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Chip
              icon={<Sparkles size={14} color="#A78BFA" />}
              label="Interactive Sandbox"
              size="small"
              sx={{
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#A78BFA',
                fontWeight: 700,
                border: '1px solid rgba(139, 92, 246, 0.3)',
                fontSize: '12px'
              }}
            />
          </div>
          <h2 className="section-title">Try ListiFy 2.0 Live</h2>
          <p className="section-desc">
            Test our instant task creation right here. Experience real-time tasks before creating your free account!
          </p>
        </div>

        {/* Interactive App Container */}
        <div className="demo-glass-container">
          {/* Header Bar */}
          <div className="demo-header-flex">
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={22} color="#8B5CF6" />
                <span>Live Task Workspace</span>
              </h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Create, organize, and complete tasks in real-time
              </p>
            </div>
          </div>

          {/* Create Task Input Controls */}
          <form onSubmit={handleAddTask} className="demo-input-form">
            <input
              type="text"
              className="demo-text-input"
              placeholder="Add a new task (e.g. Design landing page hero)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="priority-btn-group">
              <button
                type="button"
                className={`priority-chip-btn ${priority === 'high' ? 'active-high' : ''}`}
                onClick={() => setPriority('high')}
              >
                <Flame size={13} /> High
              </button>
              <button
                type="button"
                className={`priority-chip-btn ${priority === 'medium' ? 'active-medium' : ''}`}
                onClick={() => setPriority('medium')}
              >
                <Zap size={13} /> Medium
              </button>
              <button
                type="button"
                className={`priority-chip-btn ${priority === 'low' ? 'active-low' : ''}`}
                onClick={() => setPriority('low')}
              >
                <Leaf size={13} /> Low
              </button>
            </div>

            <button
              type="submit"
              className="btn-add-demo-task"
              disabled={!newTitle.trim()}
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
          </form>

          {/* Task List Render */}
          <div className="demo-tasks-list">
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                <RotateCcw size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '14px' }}>No tasks created yet. Type above to add your first task!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className={`demo-task-card ${task.completed ? 'completed' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <button
                      type="button"
                      className={`demo-checkbox-btn ${task.completed ? 'checked' : ''}`}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed && <Check size={14} strokeWidth={3} />}
                    </button>
                    <span className={`demo-task-title ${task.completed ? 'strike' : ''}`}>
                      {task.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Chip
                      label={task.priority.toUpperCase()}
                      size="small"
                      sx={{
                        fontSize: '10px',
                        fontWeight: 800,
                        height: '22px',
                        background:
                          task.priority === 'high'
                            ? 'rgba(244, 63, 94, 0.2)'
                            : task.priority === 'medium'
                            ? 'rgba(6, 182, 212, 0.2)'
                            : 'rgba(16, 185, 129, 0.2)',
                        color:
                          task.priority === 'high'
                            ? '#FB7185'
                            : task.priority === 'medium'
                            ? '#38BDF8'
                            : '#34D399',
                        border: '1px solid currentColor'
                      }}
                    />
                    <button
                      type="button"
                      className="demo-delete-btn"
                      onClick={() => deleteTask(task.id)}
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Demo;
