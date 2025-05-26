import { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { LoginRequest, UserCreate } from '../api/fastAPI.schemas';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: LoginRequest | UserCreate, mode: 'login' | 'register') => void;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onSubmit({ username, password } as LoginRequest, mode);
    } else {
      onSubmit({ email, username, fullName, password } as UserCreate, mode);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
        padding: isMobile ? theme.spacing(2) : theme.spacing(4)
      }}
      noValidate>
      <Stack spacing={2}>
        {mode === 'register' && (
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        {mode === 'register' && (
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormControl variant="outlined" fullWidth required>
          <InputLabel htmlFor="auth-password">Password</InputLabel>
          <OutlinedInput
            id="auth-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={togglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      </Stack>
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={!username || !password || (mode === 'register' && !fullName && !email)}
        sx={{ mt: theme.spacing(2) }}>
        {mode === 'login' ? 'Login' : 'Register'}
      </Button>
    </form>
  );
}
