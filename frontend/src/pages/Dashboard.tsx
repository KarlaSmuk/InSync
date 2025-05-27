import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUser } from '../hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/user/user';
import type { DashboardSummary } from '../api/fastAPI.schemas';

export default function Dashboard() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, loading: loadingUser, error: errorUser } = useUser();
  const { getUserDashboardSummaryApiUserDashboardSummaryGet } = getUser();

  const {
    data: summary,
    isLoading: loadingSummary,
    error: errorSummary
  } = useQuery<DashboardSummary>({
    queryKey: ['Dash'],
    queryFn: getUserDashboardSummaryApiUserDashboardSummaryGet
  });

  if (loadingUser || loadingSummary) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorUser || errorSummary) {
    return <Alert severity="error">Something went wrong loading your dashboard.</Alert>;
  }

  const cards = [
    {
      title: 'Workspaces',
      value: summary?.workspaceCount ?? 0,
      color: '#3b82f6',
      icon: <DashboardIcon sx={{ fontSize: 32, color: '#ffffff' }} />
    },
    {
      title: 'Your Tasks',
      value: summary?.taskCount ?? 0,
      color: '#10b981',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 32, color: '#ffffff' }} />
    },
    {
      title: 'Completed Tasks',
      value: summary?.completedTaskCount ?? 0,
      color: '#8b5cf6',
      icon: <CheckCircleIcon sx={{ fontSize: 32, color: '#ffffff' }} />
    },
    {
      title: 'Notifications',
      value: summary?.unreadNotifications ?? 0,
      color: '#f59e0b',
      icon: <NotificationsActiveIcon sx={{ fontSize: 32, color: '#ffffff' }} />
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        py: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
      <Container maxWidth="lg">
        <Typography
          variant={isSm ? 'h5' : 'h4'}
          gutterBottom
          sx={{ fontWeight: 600, color: '#1e3a8a' }}>
          Welcome, {user?.fullName}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Here’s a quick overview of your workspace, tasks, and notifications.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: theme.spacing(4),
            [theme.breakpoints.up('md')]: {
              gridTemplateColumns: '1fr 1.5fr'
            },
            '& > div:nth-of-type(1)': {
              p: 3,
              borderRadius: 2
            },
            '& > div:nth-of-type(2)': {
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing(4)
            }
          }}>
          {cards.map((card) => (
            <Card
              key={card.title}
              elevation={6}
              sx={{
                flex: '1 1 260px',
                backgroundColor: '#1f2937',
                color: '#fff',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: card.color,
                    width: 56,
                    height: 56,
                    mr: 3,
                    boxShadow: theme.shadows[3]
                  }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                    {card.title}
                  </Typography>
                  <Typography variant={isSm ? 'h4' : 'h2'} sx={{ mt: 0.5 }}>
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
