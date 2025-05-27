import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NotificationResponse } from '../api/fastAPI.schemas';
import { useUser } from '../hooks/useUser';
import { getNotifications } from '../api/notifications/notifications';
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { useTaskNotifications } from '../hooks/useTaskNotifications';

export function NotificationsList() {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();
  const {
    listUnreadNotificationsApiNotificationsUnreadGet,
    markNotificationReadApiNotificationsNotificationIdReadPatch
  } = getNotifications();

  const {
    data: notifications = [],
    isLoading,
    error
  } = useQuery<NotificationResponse[], Error>({
    queryKey: ['notifications', userId],
    queryFn: () => listUnreadNotificationsApiNotificationsUnreadGet()
  });

  const markReadMutation = useMutation<void, Error, string>({
    mutationFn: (notificationId: string) =>
      markNotificationReadApiNotificationsNotificationIdReadPatch(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    }
  });

  //WS hook for live pushes
  const { notification: liveNotification } = useTaskNotifications(userId);
  useEffect(() => {
    if (!liveNotification) return;

    queryClient.setQueryData<NotificationResponse[]>(['notifications', userId], (old = []) => {
      if (old.some((n) => n.id === liveNotification.id)) return old;
      return [liveNotification as NotificationResponse, ...old];
    });
  }, [liveNotification, queryClient, userId]);

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
    <Paper sx={{ p: 3, maxWidth: 640, mx: 'auto', mt: 2 }}>
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
            <React.Fragment key={n.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  backgroundColor: n.isRead ? 'action.hover' : 'background.paper',
                  borderLeft: 4,
                  borderColor: n.isRead ? 'grey.500' : 'primary.main',
                  pl: 2,
                  pr: 10,
                  py: 1.5
                }}
                secondaryAction={
                  !n.isRead && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => markReadMutation.mutate(n.id)}
                      disabled={markReadMutation.isPending}
                      sx={{ mr: 1 }}>
                      {markReadMutation.isPending ? 'Marking…' : 'Mark read'}
                    </Button>
                  )
                }>
                <ListItemText
                  primary={
                    <>
                      <Typography variant="subtitle2" color="textSecondary">
                        {new Date(n.notifiedAt).toLocaleString('hr-HR', {
                          timeZone: 'Europe/Zagreb'
                        })}
                      </Typography>
                      <Typography variant="h6">
                        {n.workspaceName} &ndash; {n.taskName}
                      </Typography>
                    </>
                  }
                  secondary={
                    <>
                      <Typography variant="body1" color="textPrimary">
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        by {n.creatorName} | event: {n.eventType}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
}
