import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './landing/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AuthPage } from './components/Login';
import type { User } from './types/todo';
import { removeTokens } from './services/api';

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('listify_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('listify_user', JSON.stringify(user));
    navigate('/dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('listify_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('listify_user');
    removeTokens();
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={<AuthPage onLoginSuccess={handleLoginSuccess} />}
      />
      <Route
        path="/dashboard"
        element={
          currentUser ? (
            <Dashboard user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} initialSection="dashboard" />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/tasks"
        element={
          currentUser ? (
            <Dashboard user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} initialSection="tasks" />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
