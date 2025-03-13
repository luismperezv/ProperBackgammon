import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';
import api from './axiosConfig';
import tokenService from './tokenService';

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      console.log('Login attempt with:', credentials.email);
      
      // Convert credentials to URLSearchParams (what OAuth2 expects)
      const formData = new URLSearchParams();
      formData.append('username', credentials.email); // FastAPI OAuth2 expects 'username'
      formData.append('password', credentials.password);

      console.log('Sending token request...');
      const { data } = await api.post<AuthResponse>('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Token response received:', { hasToken: !!data.access_token });
      
      if (!data.access_token) {
        throw new AuthError('No token received from server');
      }

      // Store the token and its expiry
      const expiryTime = tokenService.getTokenExpirationTime(data.access_token);
      if (expiryTime) {
        const expiresIn = Math.floor((expiryTime - new Date().getTime()) / 1000);
        tokenService.setToken(data.access_token, expiresIn);
        console.log('Token stored with expiry:', expiresIn);
      } else {
        tokenService.setToken(data.access_token);
        console.log('Token stored without expiry');
      }
      
      // Fetch user details
      console.log('Fetching user details...');
      const userResponse = await api.get<User>('/auth/me');
      console.log('User details received:', userResponse.data);
      
      return {
        user: userResponse.data,
        token: data.access_token,
      };
    } catch (error: any) {
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
      }
      if (error.response?.status === 429) {
        throw new AuthError('Too many attempts. Please try again later.', 'RATE_LIMIT');
      }
      throw this.handleError(error);
    }
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    try {
      await api.post<User>('/auth/register', credentials);
      // After registration, log the user in
      return await this.login({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new AuthError('Email already registered', 'EMAIL_EXISTS');
      }
      if (error.response?.status === 400) {
        throw new AuthError('Invalid registration data', 'INVALID_DATA');
      }
      throw this.handleError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      if (tokenService.getToken()) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.removeToken();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('Checking current user...');
      // Check if token exists and is not expired
      const token = tokenService.getToken();
      const isExpired = tokenService.isTokenExpired();
      console.log('Token status:', { hasToken: !!token, isExpired });
      
      if (!token || isExpired) {
        console.log('No valid token found');
        tokenService.removeToken();
        return null;
      }

      console.log('Fetching user details...');
      const { data } = await api.get<User>('/auth/me');
      console.log('User details received:', data);
      return data;
    } catch (error: any) {
      console.error('getCurrentUser error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        tokenService.removeToken();
      }
      return null;
    }
  },

  async validateSession(): Promise<boolean> {
    try {
      const token = tokenService.getToken();
      if (!token || tokenService.isTokenExpired()) {
        return false;
      }
      
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  },

  handleError(error: any): Error {
    if (error.response?.data?.detail) {
      return new AuthError(error.response.data.detail);
    }
    if (error.message) {
      return new AuthError(error.message);
    }
    return new AuthError('An unexpected error occurred');
  },
};

export default authService; 