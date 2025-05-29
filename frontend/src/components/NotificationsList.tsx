import { useQuery } from '@tanstack/react-query';
import type { NotificationResponse } from '../api/fastAPI.schemas';
import { getNotifications } from '../api/notifications/notifications';
import { Box, CircularProgress, Alert, List, Paper, Typography } from '@mui/material';
import { NotificationItem } from './NotificationItem';

export function NotificationsList() {
  const { listUnreadNotificationsApiNotificationsUnreadGet } = getNotifications();

  //to get all previous unread notifications
  const {
    data: notifications = [],
    isLoading,
    error
  } = useQuery<NotificationResponse[], Error>({
    queryKey: ['notifications'],
    queryFn: () => listUnreadNotificationsApiNotificationsUnreadGet()
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">Error loading notifications: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No notifications.
        </Typography>
      ) : (
        <List disablePadding>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </List>
      )}
    </Paper>
  );
}
