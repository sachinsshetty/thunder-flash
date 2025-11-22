import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import UserCaptures from './UserCaptures';

interface UserCapture {
  id: number;
  userId: string;
  queryText: string;
  image: string;
  latitude: number;
  longitude: number;
  aiResponse: string;
  createdAt: string;
}

const camelizeKeys = (obj: any): any => {
  const camelize = (str: string): string =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

  if (Array.isArray(obj)) {
    return obj.map(camelizeKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: Record<string, any>, key: string) => {
      result[camelize(key)] = camelizeKeys(obj[key]);
      return result;
    }, {} as Record<string, any>);
  }
  return obj;
};

const getApiBaseUrl = (): string => {
  let baseUrl = import.meta.env.VITE_DWANI_API_BASE_URL || 'http://localhost:8000';
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    baseUrl = baseUrl.replace(/^http:/, 'https:');
    if (baseUrl.includes('localhost')) {
      baseUrl = 'https://localhost:8000';
    }
  }
  return baseUrl;
};

const UserApp = () => {
  const [captures, setCaptures] = useState<UserCapture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCaptures = async (retries = 3) => {
    try {
      const apiUrl = `${getApiBaseUrl()}/v1/user-captures`;
      console.log('Fetching captures from:', apiUrl);

      const res = await fetch(apiUrl);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${res.statusText} — ${text}`);
      }

      const data = await res.json();
      const camelized = camelizeKeys(data);
      setCaptures(camelized);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Fetch failed:', err);

      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => fetchCaptures(retries - 1), 1500);
      } else {
        setError(`Failed to load captures: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptures();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          bgcolor: '#0a1929',
          color: 'grey.300',
        }}
      >
        <CircularProgress size={60} thickness={5} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading captures...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchCaptures();
              }}
            >
              Retry
            </Button>
          }
          sx={{ fontSize: '1rem', py: 2 }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Main content: Only the table
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a1929',
        color: 'grey.200',
        p: 3,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 4, color: '#64ffda' }}
        >
          User Captures
        </Typography>

        {/* Only the table */}
        <UserCaptures captures={captures} />
      </Container>
    </Box>
  );
};

export default UserApp;