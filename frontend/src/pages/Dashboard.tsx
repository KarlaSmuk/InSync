import { Container, Box, Typography } from '@mui/material';
import { getCurrentUser } from '../utils/auth';
import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser
  });

  if (isLoading) return <p>Loading user info...</p>;
  if (error) return <p>Error loading user.</p>;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1">Welcome, {user?.username}! </Typography>
        {JSON.stringify(user, null, 2)}
      </Box>
    </Container>
  );
}

export default Dashboard;
