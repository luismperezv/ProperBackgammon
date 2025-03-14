import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import authService, { AuthError } from '../services/authService';
import tokenService from '../services/tokenService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  errorCode?: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    errorCode: undefined,
  });

  const setError = (error: AuthError | null) => {
    setState(prev => ({
      ...prev,
      error: error?.message || null,
      errorCode: error?.code,
      isLoading: false,
    }));
  };

  const clearError = () => setError(null);

  const login = async (credentials: LoginCredentials) => {
    console.log('Login attempt started');
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user } = await authService.login(credentials);
      console.log('Login successful, user:', user);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        errorCode: undefined,
      });
      navigate('/dashboard');
    } catch (error) {
      console.log('Login failed:', error);
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: (error as AuthError).message || 'Login failed',
        errorCode: (error as AuthError).code,
      }));
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user } = await authService.register(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        errorCode: undefined,
      });
      navigate('/dashboard');
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await authService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      errorCode: undefined,
    });
  };

  const checkAuth = useCallback(async () => {
    // Skip auth check if we're on the login or auth pages
    if (window.location.pathname === '/auth' || window.location.pathname === '/') {
      setState(prev => {
        if (prev.isLoading) {
          return { ...prev, isLoading: false };
        }
        return prev;
      });
      return;
    }

    if (!tokenService.getToken()) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      return;
    }

    try {
      const isValid = await authService.validateSession();
      if (!isValid) {
        throw new AuthError('Session expired', 'SESSION_EXPIRED');
      }

      const user = await authService.getCurrentUser();
      if (user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          errorCode: undefined,
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
        }));
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: (error as AuthError).message,
        errorCode: (error as AuthError).code,
      });
      tokenService.removeToken();
    }
  }, []); // Remove all dependencies

  // Use a ref to track initial mount
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only run checkAuth on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      checkAuth();
    }
  }, [checkAuth]);

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };
}; 