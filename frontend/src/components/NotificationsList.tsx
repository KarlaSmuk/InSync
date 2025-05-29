import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { NotificationResponse } from '../api/fastAPI.schemas';
import { useUser } from '../hooks/useUser';
import { getNotifications } from '../api/notifications/notifications';
import { Box, CircularProgress, Alert, List, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTaskNotifications } from '../hooks/useTaskNotifications';
import { NotificationItem } from './NotificationItem';

export function NotificationsList() {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();
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

  //web socket hook for live messages
  const { notification: liveNotification } = useTaskNotifications(userId);

  useEffect(() => {
    if (!liveNotification) return;

    //add new message to list of notifications
    queryClient.setQueryData<NotificationResponse[]>(['notifications'], (old = []) => {
      if (old.some((n) => n.id === liveNotification.id)) return old;
      return [liveNotification as NotificationResponse, ...old];
    });
  }, [liveNotification, queryClient]);

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
          {notifications.map((n) => (
            <NotificationItem notification={n} />
          ))}
        </List>
      )}
    </Paper>
  );
}
