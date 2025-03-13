import React from 'react';
import { AppRoutes } from './routes';
import { CustomThemeProvider } from './theme/ThemeProvider';

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AppRoutes />
    </CustomThemeProvider>
  );
};

export default App; 