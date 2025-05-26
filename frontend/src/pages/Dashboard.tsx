import { Box, Typography, Alert, CircularProgress, Card } from '@mui/material';
import { useUser } from '../hooks/useUser';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/user/user';

export default function Dashboard() {
  const { user, loading: loadingUser, error: errorUser } = useUser();
  const { getUserDashboardSummaryApiUserDashboardSummaryGet } = getUser();

  const { data: summary } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: () => getUserDashboardSummaryApiUserDashboardSummaryGet()
  });

  if (loadingUser) return <CircularProgress />;
  if (errorUser) return <Alert severity="error">Could not load user data</Alert>;

  return (
    <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', p: 4 }}>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 3,
          p: 4,
          boxShadow: 3
        }}>
        <Typography variant="h4" gutterBottom color="primary">
          Welcome, {user?.fullName}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }} color="text.secondary">
          Here’s a quick overview of your work.
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          {/* Card: Workspaces */}
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderLeft: '6px solid #3b82f6',
              backgroundColor: '#f8fafc'
            }}>
            <DashboardIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" color="text.secondary">
                Workspaces
              </Typography>
              <Typography color="#3b82f6" variant="h4">
                {summary?.workspaceCount ?? 0}
              </Typography>
            </Box>
          </Card>

          {/* Card: Tasks */}
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderLeft: '6px solid #10b981',
              backgroundColor: '#f8fafc'
            }}>
            <AssignmentIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" color="text.secondary">
                Your Tasks
              </Typography>
              <Typography variant="h4" color="#10b981">
                {summary?.taskCount ?? 0}
              </Typography>
            </Box>
          </Card>

          {/* Card: Notifications */}
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderLeft: '6px solid #f59e0b',
              backgroundColor: '#f8fafc'
            }}>
            <NotificationsIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" color="text.secondary">
                Unread Notifications
              </Typography>
              <Typography variant="h4" color="#f59e0b">
                {summary?.unreadNotifications ?? 0}
              </Typography>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
