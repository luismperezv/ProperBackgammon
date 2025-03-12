import { ThemeOptions } from '@mui/material/styles';

interface MD3Token {
  value: string | number;
  type: string;
}

interface MD3Theme {
  schemes: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  ref: Record<string, MD3Token>;
}

export const convertMD3ToMUI = (md3Theme: MD3Theme, mode: 'light' | 'dark'): ThemeOptions => {
  const scheme = md3Theme.schemes[mode];

  return {
    palette: {
      mode,
      primary: {
        main: scheme.primary,
        light: scheme.primary,
        dark: scheme.primaryContainer,
        contrastText: scheme.onPrimary,
      },
      secondary: {
        main: scheme.secondary,
        light: scheme.secondary,
        dark: scheme.secondaryContainer,
        contrastText: scheme.onSecondary,
      },
      error: {
        main: scheme.error,
        light: scheme.error,
        dark: scheme.errorContainer,
        contrastText: scheme.onError,
      },
      background: {
        default: scheme.background,
        paper: scheme.surface,
      },
      text: {
        primary: scheme.onSurface,
        secondary: scheme.onSurfaceVariant,
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '20px',
          },
          contained: {
            backgroundColor: scheme.primary,
            color: scheme.onPrimary,
            '&:hover': {
              backgroundColor: scheme.primaryContainer,
              color: scheme.onPrimaryContainer,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };
}; 