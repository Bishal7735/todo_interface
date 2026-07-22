import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types/todo';
import { removeTokens } from '../service/auth';

interface AuthContextType {
  currentUser: User | null;
  loginUser: (user: User) => void;
  updateUser: (user: User) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const loginUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('listify_user', JSON.stringify(user));
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('listify_user', JSON.stringify(updatedUser));
  };

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
