import { ReactNode } from 'react'
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { DebugTools } from './debug/DebugTools'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
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