// ==========================================
// MAIN APPLICATION ENTRY POINT & ROUTER (React)
// This file sets up application page routes (Landing Page, Login, Register, Dashboard, Tasks)
// and handles session routing, demo task syncing, and protected route navigation.
// ==========================================

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { User } from './types/todo';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createTask } from './service/task';

// Lazy loading pages for fast initial page load performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));

/**
 * Sync tasks created on the public landing page demo to the user's database account on login.
 */
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

/**
 * AppRoutes Component:
 * Defines navigation routes and handles login/logout redirects.
 */
function AppRoutes() {
  const navigate = useNavigate();
  const { currentUser, loginUser, updateUser, logoutUser } = useAuth();

  // Handler for successful login / registration
  const handleLoginSuccess = async (user: User) => {
    loginUser(user);
    await syncDemoTasksToDatabase();
    navigate('/dashboard');
  };

  // Handler for user logout
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050713' }} />}>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Protected Dashboard Routes */}
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

        {/* Catch-all fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

/**
 * Root App Component:
 * Wraps routes inside AuthProvider context.
 */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
