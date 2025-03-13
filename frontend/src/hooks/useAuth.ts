import { useState, useEffect, useCallback } from 'react';
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
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user } = await authService.login(credentials);
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
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
        errorCode: undefined,
      });
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
  }, []);

  useEffect(() => {
    checkAuth();
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