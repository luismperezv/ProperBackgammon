import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { ErrorAlert } from '../common/ErrorAlert';

export const LoginForm: React.FC = () => {
  const { login, error: authError, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    setFormError(null);
    clearError();
  };

  const handleErrorClose = () => {
    setFormError(null);
    clearError();
  };

  const validateForm = () => {
    if (!formData.email) {
      setFormError('Email is required');
      return false;
    }
    if (!formData.password) {
      setFormError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
    } catch (err: any) {
      const errorMessage = typeof err.message === 'string' 
        ? err.message 
        : 'Failed to login. Please try again.';
      setFormError(errorMessage);
      // Prevent the form from being cleared on error
      return;
    }
  };

  return (
    <>
      <LoadingOverlay open={isLoading} message="Logging in..." />
      
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {(formError || authError) && (
          <ErrorAlert 
            error={formError || authError}
            onClose={handleErrorClose}
            title="Login Error"
            severity="error"
          />
        )}

        <form 
          onSubmit={handleSubmit} 
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          noValidate
        >
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="email"
            error={!!formError && !formData.email}
            helperText={(!formData.email && formError) ? 'Email is required' : ''}
            disabled={isLoading}
            sx={{
              '& .MuiInputBase-input:-webkit-autofill': {
                '-webkit-box-shadow': '0 0 0 100px var(--mui-palette-background-default) inset',
                '-webkit-text-fill-color': 'var(--mui-palette-text-primary)',
              },
              '& .MuiInputBase-input:-webkit-autofill + fieldset': {
                borderColor: 'var(--mui-palette-primary-main)',
                borderWidth: '2px',
              },
              '& .MuiInputBase-input:-webkit-autofill ~ label': {
                transform: 'translate(14px, -9px) scale(0.75)',
                background: 'var(--mui-palette-background-default)',
                padding: '0 8px',
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="current-password"
            error={!!formError && !formData.password}
            helperText={(!formData.password && formError) ? 'Password is required' : ''}
            disabled={isLoading}
            sx={{
              '& .MuiInputBase-input:-webkit-autofill': {
                '-webkit-box-shadow': '0 0 0 100px var(--mui-palette-background-default) inset',
                '-webkit-text-fill-color': 'var(--mui-palette-text-primary)',
              },
              '& .MuiInputBase-input:-webkit-autofill + fieldset': {
                borderColor: 'var(--mui-palette-primary-main)',
                borderWidth: '2px',
              },
              '& .MuiInputBase-input:-webkit-autofill ~ label': {
                transform: 'translate(14px, -9px) scale(0.75)',
                background: 'var(--mui-palette-background-default)',
                padding: '0 8px',
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </>
  );
}; 