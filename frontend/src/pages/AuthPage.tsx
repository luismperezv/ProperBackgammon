import React, { useState, useEffect } from 'react';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type AuthView = 'login' | 'register';

interface LocationState {
  initialView?: AuthView;
  from?: Location;
}

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, error, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>('login');

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.initialView) {
      setCurrentView(state.initialView);
    }
  }, [location.state]);

  if (isAuthenticated && !error && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleViewChange = (_: React.SyntheticEvent, newValue: AuthView) => {
    setCurrentView(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 500,
          p: 3,
        }}
      >
        <Tabs
          value={currentView}
          onChange={handleViewChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>

        {currentView === 'login' ? <LoginForm /> : <RegisterForm />}
      </Paper>
    </Box>
  );
}; 