import React from 'react';
import { Dashboard } from '../components/Dashboard';
import type { User } from '../types/todo';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  initialSection?: 'dashboard' | 'tasks' | 'analytics' | 'settings';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onLogout,
  onUpdateUser,
  initialSection = 'dashboard',
}) => {
  return (
    <Dashboard
      user={user}
      onLogout={onLogout}
      onUpdateUser={onUpdateUser}
      initialSection={initialSection}
    />
  );
};

export default DashboardPage;
