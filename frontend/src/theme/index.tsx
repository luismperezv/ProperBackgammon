import React, { useMemo, useState, createContext, useContext, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { convertMD3ToMUI } from './md3/themeAdapter';
import type { FC } from 'react';
import themeJson from './md3/theme.json';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

const useCustomTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: FC<ThemeProviderProps> = ({ 
  children 
}): React.ReactElement => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    const themeOptions = convertMD3ToMUI(themeJson, mode);
    return createTheme(themeOptions);
  }, [mode]);

  const contextValue = useMemo(
    () => ({
      toggleColorMode,
      mode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { useCustomTheme };
export type { ThemeProviderProps, ThemeContextType }; 