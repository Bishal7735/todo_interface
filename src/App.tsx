import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { User } from './types/todo';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createTask } from './service/task';

const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));

async function syncDemoTasksToDatabase() {
  try {
    const saved = sessionStorage.getItem('listify_demo_tasks');
    if (saved) {
      const demoTasks = JSON.parse(saved);
      if (Array.isArray(demoTasks) && demoTasks.length > 0) {
        for (const t of demoTasks) {
          if (t && t.title) {
            await createTask({
              title: t.title,
              description: '',
              category: 'Work',
              priority: t.priority || 'medium',
              status: t.completed ? 'completed' : 'todo',
              dueDate: '',
              subtasks: [],
              tags: []
            });
          }
        }
        sessionStorage.removeItem('listify_demo_tasks');
        sessionStorage.removeItem('listify_demo_task_count');
      }
    }
  } catch (err) {
    console.error('Failed to sync demo tasks to database:', err);
  }
}

function AppRoutes() {
  const navigate = useNavigate();
  const { currentUser, loginUser, updateUser, logoutUser } = useAuth();

  const handleLoginSuccess = async (user: User) => {
    loginUser(user);
    await syncDemoTasksToDatabase();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050713' }} />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <DashboardPage
                user={currentUser}
                onLogout={handleLogout}
                onUpdateUser={updateUser}
                initialSection="dashboard"
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tasks"
          element={
            currentUser ? (
              <DashboardPage
                user={currentUser}
                onLogout={handleLogout}
                onUpdateUser={updateUser}
                initialSection="tasks"
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
