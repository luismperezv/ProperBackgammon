import React from 'react';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ErrorAlertProps {
  error: string | null;
  onClose?: () => void;
  severity?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onClose,
  severity = 'error',
  title,
}) => {
  return (
    <Collapse in={!!error}>
      <Alert
        severity={severity}
        action={
          onClose && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        sx={{ mb: 2 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {error}
      </Alert>
    </Collapse>
  );
}; 