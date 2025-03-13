import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            py: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 600,
              width: '100%',
              background: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: theme.shadows[3],
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              Welcome to Backgammon
            </Typography>

            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 4,
                color: theme.palette.text.secondary,
                maxWidth: 450,
                lineHeight: 1.6,
              }}
            >
              Experience the classic board game in a modern way. Challenge friends and improve your skills!
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ width: '100%', maxWidth: 400 }}
            >
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/auth', { state: { initialView: 'login' } })}
                sx={{
                  py: 1.5,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => navigate('/auth', { state: { initialView: 'register' } })}
                sx={{
                  py: 1.5,
                  borderWidth: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Register
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}; 