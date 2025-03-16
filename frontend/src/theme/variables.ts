import { PaletteOptions } from '@mui/material/styles';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
  secondary: {
    main: '#f50057',
    light: '#ff4081',
    dark: '#c51162',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#90caf9',
    light: '#e3f2fd',
    dark: '#42a5f5',
  },
  secondary: {
    main: '#f48fb1',
    light: '#fce4ec',
    dark: '#f06292',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
};

export const commonComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        textTransform: 'none',
        transition: 'all 0.2s ease-in-out',
        fontWeight: 600,
        '&:hover': {
          transform: 'scale(1.05)',
        },
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
          transform: 'scale(1.05)',
        },
      },
      sizeLarge: {
        padding: '12px 24px',
        fontSize: '1.25rem',
        fontWeight: 700,
      },
      sizeMedium: {
        padding: '8px 16px',
        fontSize: '1.1rem',
        fontWeight: 600,
      },
    },
    defaultProps: {
      disableElevation: true, // Follows MD3 style
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
}; 