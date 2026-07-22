// ==========================================
// GLOBAL AUTHENTICATION CONTEXT (React Context API)
// This file manages the globally shared user authentication state across the entire app.
// It allows any component to access current user info, log in, update profile, or log out.
// ==========================================

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types/todo';
import { removeTokens } from '../service/auth';

// Context interface type definition
interface AuthContextType {
  currentUser: User | null;
  loginUser: (user: User) => void;
  updateUser: (user: User) => void;
  logoutUser: () => void;
}

// Create React AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component:
 * Wraps the app root to provide authentication state to all child components.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize current user state from browser localStorage if available
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

  // Store user state and save user profile to localStorage on login
  const loginUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('listify_user', JSON.stringify(user));
  };

  // Update user profile information (e.g. name, role)
  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('listify_user', JSON.stringify(updatedUser));
  };

  // Clear user state, remove local profile data, and clear JWT tokens on logout
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('listify_user');
    localStorage.removeItem('listify_tasks');
    localStorage.removeItem('taskpulse_tasks');
    removeTokens();
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginUser, updateUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: useAuth
 * Convenient shortcut for components to access authentication methods and current user.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
