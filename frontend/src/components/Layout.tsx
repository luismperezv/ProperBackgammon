import { ReactNode } from 'react'
import { Box, AppBar, Toolbar, Typography, Container, IconButton, Tooltip } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { DebugTools } from './debug/DebugTools'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useTheme } from '../theme/index.tsx'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const { mode, toggleColorMode } = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ 
              color: 'white',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            Backgammon Online
          </Typography>
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton 
              onClick={toggleColorMode} 
              color="inherit"
              sx={{ ml: 1 }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      {import.meta.env.DEV && <DebugTools />}
    </Box>
  )
}

export default Layout 