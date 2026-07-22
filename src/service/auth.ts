// ==========================================
// AUTHENTICATION SERVICE (Frontend)
// This file handles user login, user registration, 
// and storing JWT access/refresh tokens in browser localStorage.
// ==========================================

import api from './interceptor';

// Storage keys for browser localStorage
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// User data interface structure
export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role?: string;
  avatarInitials?: string;
}

// Authentication response object returned by backend server
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  token?: string;
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

// ------------------------------------------
// TOKEN STORAGE HELPER FUNCTIONS
// ------------------------------------------

// Read access token from browser storage
export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

// Save access token to browser storage
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Read refresh token from browser storage
export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

// Save refresh token to browser storage
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

// Clear all tokens when user logs out
export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ------------------------------------------
// AUTHENTICATION API CALLS
// ------------------------------------------

/**
 * Log in an existing user with email and password.
 * Saves returned JWT access and refresh tokens to localStorage on success.
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Send email and password to backend login endpoint
    const res: any = await api.post('/auth/login', { email, password });
    const responseData = res?.data || res;

    // Check if backend returned an error string
    if (typeof responseData === 'string') {
      throw new Error(responseData);
    }

    // Extract access token from backend response
    const token = responseData?.accessToken || responseData?.token;
    if (!token) {
      throw new Error('Login failed: Invalid email or password');
    }

    // Store tokens locally in browser
    setToken(token);
    if (responseData.refreshToken) setRefreshToken(responseData.refreshToken);
    return responseData;
  } catch (error: any) {
    // Extract exact backend error message for toast notification
    const message =
      error?.response?.data?.message ||
      (typeof error?.response?.data === 'string' ? error.response.data : null) ||
      error?.message ||
      'Login failed';
    throw new Error(message);
  }
};

/**
 * Register a new user account with full name, email, password, and mobile number.
 * Automatically logs in the new user on successful registration.
 */
export const register = async (
  fullName: string,
  email: string,
  password: string,
  mobileNumber?: string
): Promise<AuthResponse> => {
  try {
    // Split full name into first name and last name for backend compatibility
    const nameParts = fullName.trim().split(/\s+/);
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    // Send registration payload to backend
    const res: any = await api.post('/auth/register', {
      first_name,
      last_name,
      email,
      password,
      mob_number: mobileNumber || '',
    });
    const responseData = res?.data || res;

    if (typeof responseData === 'string') {
      throw new Error(responseData);
    }

    const token = responseData?.accessToken || responseData?.token;
    if (!token) {
      throw new Error('Registration failed: Unable to obtain access token');
    }

    // Save tokens locally
    setToken(token);
    if (responseData.refreshToken) setRefreshToken(responseData.refreshToken);
    return responseData;
  } catch (error: any) {
    // Extract exact backend error message
    const message =
      error?.response?.data?.message ||
      (typeof error?.response?.data === 'string' ? error.response.data : null) ||
      error?.message ||
      'Registration failed';
    throw new Error(message);
  }
};

// Export auth service object for convenient importing across components
export const authService = {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  removeTokens,
  login,
  register,
};

export default authService;
