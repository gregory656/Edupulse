import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      p={3}
      textAlign="center"
    >
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom color="error">
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
      </Typography>
      <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
        <Typography variant="body2">
          <strong>Error:</strong> {error.message}
        </Typography>
      </Alert>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={resetErrorBoundary}
        size="large"
      >
        Try Again
      </Button>
    </Box>
  );
};

const logError = (error, errorInfo) => {
  console.error('Error caught by boundary:', error, errorInfo);
  // Here you could send the error to an error reporting service like Sentry
};

export const ErrorBoundary = ({ children, fallback: FallbackComponent }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent || ErrorFallback}
      onError={logError}
      onReset={() => {
        // Reset any state that might have caused the error
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;