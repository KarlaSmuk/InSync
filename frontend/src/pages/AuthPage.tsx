import { useState } from 'react';
import { Container, Typography, Tabs, Tab, Paper, Alert } from '@mui/material';
import AuthForm from '../components/AuthForm';
import { getAuth } from '../api/auth/auth';
import type { LoginRequest, UserCreate } from '../api/fastAPI.schemas';
import { saveAccessToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { registerUserApiAuthRegisterPost, loginApiAuthLoginPost } = getAuth();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setErrorMessage(''); // Clear error message when switching tabs
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => loginApiAuthLoginPost(data),
    onSuccess: (response) => {
      saveAccessToken(response.accessToken);
      navigate('/');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error?.response?.data?.detail || 'Login failed';
      setErrorMessage(message);
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: UserCreate) => registerUserApiAuthRegisterPost(data),
    onSuccess: () => {
      setTab(0); // switch to login
      setErrorMessage('');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error?.message || 'Registration failed';
      setErrorMessage(message);
    }
  });

  const handleAuthSubmit = async (data: LoginRequest | UserCreate, mode: 'login' | 'register') => {
    if (mode === 'login') {
      loginMutation.mutate(data as LoginRequest);
    } else {
      registerMutation.mutate(data as UserCreate);
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
      }}>
      <Paper
        elevation={4}
        sx={{
          width: '500px',
          height: '580px',
          p: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
        <Typography
          component="h1"
          variant="h4"
          fontWeight={600}
          color="primary"
          marginBottom={'8px'}>
          InSync
        </Typography>
        <Typography component="p" variant="body2" color="text.secondary" marginBottom={'32px'}>
          Project Management App
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ marginBottom: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <AuthForm mode={tab === 0 ? 'login' : 'register'} onSubmit={handleAuthSubmit} />
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default AuthPage;
