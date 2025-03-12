import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { CustomThemeProvider } from './theme/index.tsx'
import themeJson from './theme/md3/theme.json'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Game from './pages/Game'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <CustomThemeProvider initialTheme={themeJson}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </CustomThemeProvider>
    </ErrorBoundary>
  )
}

export default App 