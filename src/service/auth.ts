import api from './interceptor';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role?: string;
  avatarInitials?: string;
}

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

// Token Storage Handlers
export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Auth API Methods
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res: any = await api.post('/auth/login', { email, password });
  const responseData = res?.data || res;

  if (typeof responseData === 'string') {
    throw new Error(responseData);
  }

  const token = responseData?.accessToken || responseData?.token;
  if (!token) {
    throw new Error('Login failed: Invalid email or password');
  }

  setToken(token);
  if (responseData.refreshToken) setRefreshToken(responseData.refreshToken);
  return responseData;
};

export const register = async (
  fullName: string,
  email: string,
  password: string,
  mobileNumber?: string
): Promise<AuthResponse> => {
  const nameParts = fullName.trim().split(/\s+/);
  const first_name = nameParts[0] || '';
  const last_name = nameParts.slice(1).join(' ') || '';

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

  setToken(token);
  if (responseData.refreshToken) setRefreshToken(responseData.refreshToken);
  return responseData;
};

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
