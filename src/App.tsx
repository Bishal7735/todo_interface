import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import type { User } from './types/todo';
import { AuthProvider, useAuth } from './context/AuthContext';

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
