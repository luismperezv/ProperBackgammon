import React, { useMemo, useState, createContext, useContext, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { convertMD3ToMUI } from './md3/themeAdapter';

// You'll need to import your JSON theme here
// import themeJson from './md3/theme.json';

interface ThemeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: any; // Your MD3 theme JSON
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme 
}: ThemeProviderProps): React.ReactElement => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    const themeOptions = convertMD3ToMUI(initialTheme, mode);
    return createTheme(themeOptions);
  }, [initialTheme, mode]);

  const contextValue = useMemo(
    () => ({
      toggleColorMode,
      mode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default CustomThemeProvider; 