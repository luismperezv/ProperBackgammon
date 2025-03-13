import React from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreateGame = async () => {
    try {
      const game = await api.createGame();
      navigate(`/game/${game.id}`);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Session Expired
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please log in again.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Go to Landing Page
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You're now logged into your dashboard.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGame}
          >
            Start New Game
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}; 