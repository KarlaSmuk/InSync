import { useState } from 'react';
import {
  Container,
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Alert,
  useMediaQuery,
  useTheme,
  Link,
  Snackbar
} from '@mui/material';
import AuthForm from '../components/AuthForm';
import { getAuth } from '../api/auth/auth';
import type { LoginRequest, UserCreate } from '../api/fastAPI.schemas';
import { getCurrentUser, saveAccessToken } from '../utils/auth';
import { useNavigate, type ErrorResponse } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useUser } from '../hooks/useUser';

function AuthPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { setUser } = useUser();

  const { registerUserApiAuthRegisterPost, loginApiAuthLoginPost } = getAuth();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setErrorMessage('');
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => loginApiAuthLoginPost(data),
    onSuccess: async (response) => {
      saveAccessToken(response.accessToken);
      const user = await getCurrentUser(); // fetch user from backend

      if (user) {
        setUser(user); // update context
      }
      navigate('/');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setErrorMessage(error.message || 'Login failed');
      setShowToast(true);
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: UserCreate) => registerUserApiAuthRegisterPost(data),
    onSuccess: () => {
      setTab(0);
      setErrorMessage('Account created! Please log in.');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setErrorMessage(error.message || 'Registration failed');
      setShowToast(true);
    }
  });

  const handleAuthSubmit = (data: LoginRequest | UserCreate) => {
    if (tab === 0) {
      loginMutation.mutate(data as LoginRequest);
    } else {
      registerMutation.mutate(data as UserCreate);
    }
  };

  return (
    <Container
      disableGutters
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
      }}>
      <Card
        elevation={6}
        sx={{
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(20, 30, 50, 0.9)',
          borderRadius: 3,
          p: 4,
          width: isMobile ? '90%' : 400,
          textAlign: 'center'
        }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} color="primary" gutterBottom>
          InSync
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Project Management Simplified
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <AuthForm mode={tab === 0 ? 'login' : 'register'} onSubmit={handleAuthSubmit} />

        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setShowToast(false)} severity={'error'}>
            {errorMessage}
          </Alert>
        </Snackbar>

        <Box mt={3}>
          {tab === 0 ? (
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component="button" variant="body2" onClick={() => setTab(1)}>
                Register
              </Link>
            </Typography>
          ) : (
            <Typography variant="body2">
              Already registered?{' '}
              <Link component="button" variant="body2" onClick={() => setTab(0)}>
                Login
              </Link>
            </Typography>
          )}
        </Box>

        {/* {tab === 0 && (
          <Box mt={1}>
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
        )} */}
      </Card>
    </Container>
  );
}

export default AuthPage;
