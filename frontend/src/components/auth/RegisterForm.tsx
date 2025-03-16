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
import { PasswordInput } from './PasswordInput';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const { register, error: authError, isLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
  };

  const validateForm = (): boolean => {
    if (!formData.username) {
      setFormError('Username is required');
      return false;
    }
    if (!formData.email) {
      setFormError('Email is required');
      return false;
    }
    if (!formData.password) {
      setFormError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
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
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (err) {
      const error = err as Error;
      if ((err as any).code === 'EMAIL_EXISTS') {
        setFormError('This email address is already registered. Please use a different email or try logging in.');
      } else if ((err as any).code === 'USERNAME_EXISTS') {
        setFormError('This username is already taken. Please choose a different username.');
      } else {
        setFormError(error.message);
      }
    }
  };

  const inputSx = {
    '& .MuiInputBase-input': {
      '&:-webkit-autofill': {
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: '0 0 0px 1000px transparent inset',
        WebkitTextFillColor: 'var(--mui-palette-text-primary)',
      },
    },
    '& .MuiInputLabel-root': {
      backgroundColor: 'var(--mui-palette-background-paper)',
      px: 1,
    },
  };

  return (
    <>
      <LoadingOverlay open={isLoading} message="Creating your account..." />

      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Create Account
        </Typography>

        <ErrorAlert 
          error={formError || authError}
          onClose={() => setFormError(null)}
          title="Registration Error"
        />

        <form 
          onSubmit={handleSubmit} 
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          noValidate
        >
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="username"
            error={!!formError && !formData.username}
            helperText={(!formData.username && formError) ? 'Username is required' : ''}
            disabled={isLoading}
            sx={inputSx}
          />

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
            sx={inputSx}
          />

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!formError && (!formData.password || formData.password.length < 8)}
            helperText={
              (!formData.password && formError)
                ? 'Password is required'
                : 'Password must be at least 8 characters long'
            }
            disabled={isLoading}
            autoComplete="new-password"
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!formError && formData.password !== formData.confirmPassword}
            helperText={
              (formData.password !== formData.confirmPassword && formError)
                ? 'Passwords do not match'
                : ''
            }
            disabled={isLoading}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            Create Account
          </Button>
        </form>
      </Box>
    </>
  );
}; 