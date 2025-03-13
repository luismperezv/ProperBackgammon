import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { ErrorAlert } from '../common/ErrorAlert';

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
      setFormError((err as Error).message);
    }
  };

  return (
    <>
      <LoadingOverlay open={isLoading} message="Creating your account..." />

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          mx: 'auto', 
          mt: 4,
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="new-password"
            error={!!formError && (!formData.password || formData.password.length < 8)}
            helperText={
              (!formData.password && formError)
                ? 'Password is required'
                : 'Password must be at least 8 characters long'
            }
            disabled={isLoading}
          />

          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="new-password"
            error={!!formError && formData.password !== formData.confirmPassword}
            helperText={
              (formData.password !== formData.confirmPassword && formError)
                ? 'Passwords do not match'
                : ''
            }
            disabled={isLoading}
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
      </Paper>
    </>
  );
}; 