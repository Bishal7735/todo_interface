import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { User } from './types/todo';
import { AuthProvider, useAuth } from './context/AuthContext';

const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));

function AppRoutes() {
  const navigate = useNavigate();
  const { currentUser, loginUser, updateUser, logoutUser } = useAuth();

  const handleLoginSuccess = (user: User) => {
    loginUser(user);
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
