import { Theme, ThemeOptions } from '@mui/material/styles';
import { convertMD3ToMUI } from './md3/themeAdapter';
import themeJson from './md3/theme.json';
import { lightPalette, darkPalette, commonComponents } from './variables';

export const createCustomTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  // Get the base MD3 theme
  const md3Theme = convertMD3ToMUI(themeJson, mode);
  
  // Merge with our custom theme options
  return {
    ...md3Theme,
    palette: mode === 'light' ? lightPalette : darkPalette,
    components: {
      ...md3Theme.components,
      ...commonComponents,
    },
    typography: {
      ...md3Theme.typography,
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    shape: {
      borderRadius: 8,
    },
  };
}; 