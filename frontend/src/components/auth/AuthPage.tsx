import React, { useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <Button
          onClick={() => setIsLogin(!isLogin)}
          sx={{ mt: 2 }}
          color="primary"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </Button>
      </Box>
    </Container>
  );
}; 