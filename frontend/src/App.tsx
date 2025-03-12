import React from 'react';
import { Outlet } from 'react-router-dom'
import { CustomThemeProvider } from './theme/index.tsx'
import themeJson from './theme/md3/theme.json'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <CustomThemeProvider initialTheme={themeJson}>
        <CssBaseline />
        <Layout>
          <Outlet />
        </Layout>
      </CustomThemeProvider>
    </ErrorBoundary>
  )
}

export default App 