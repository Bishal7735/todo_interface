import React from 'react';
import { AuthPage } from '../components/Login';
import type { User } from '../types/todo';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  return <AuthPage onLoginSuccess={onLoginSuccess} />;
};

export default LoginPage;
