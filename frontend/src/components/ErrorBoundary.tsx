import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ApiError } from '../services/api';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            const error = this.state.error;
            const isApiError = error instanceof ApiError;

            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="200px"
                    p={3}
                    textAlign="center"
                >
                    <Typography variant="h5" color="error" gutterBottom>
                        {isApiError ? 'API Error' : 'Something went wrong'}
                    </Typography>
                    <Typography color="textSecondary" paragraph>
                        {error?.message || 'An unexpected error occurred'}
                    </Typography>
                    {isApiError && error.details && (
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            {JSON.stringify(error.details, null, 2)}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleRetry}
                    >
                        Try Again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 