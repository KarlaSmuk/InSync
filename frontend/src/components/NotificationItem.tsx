import { Box, Button, Divider, ListItem, ListItemText, Typography } from '@mui/material';
import type { NotificationResponse } from '../api/fastAPI.schemas';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { getNotifications } from '../api/notifications/notifications';

interface NotificationItemProps {
  notification: NotificationResponse;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const queryClient = useQueryClient();
  const { markNotificationReadApiNotificationsNotificationIdReadPatch } = getNotifications();

  const markReadMutation = useMutation<void, Error, string>({
    mutationFn: (notificationId: string) =>
      markNotificationReadApiNotificationsNotificationIdReadPatch(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  return (
    <Box key={notification.id}>
      <ListItem
        alignItems="flex-start"
        sx={{
          backgroundColor: notification.isRead ? 'action.hover' : 'background.paper',
          borderLeft: 4,
          borderColor: notification.isRead ? 'grey.500' : 'primary.main',
          pl: 2,
          pr: 10,
          py: 1.5,
          '& .MuiListItemSecondaryAction-root': {
            top: '24px',
            right: '12px'
          }
        }}
        secondaryAction={
          !notification.isRead && (
            <Button
              key={notification.id}
              variant="contained"
              size="small"
              onClick={() => markReadMutation.mutate(notification.id)}
              disabled={markReadMutation.isPending}>
              {markReadMutation.isPending ? 'Marking…' : 'Mark read'}
            </Button>
          )
        }>
        <ListItemText
          primary={
            <>
              <Typography variant="subtitle2" color="textSecondary">
                {new Date(notification.notifiedAt).toLocaleString(undefined, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
              <Typography variant="h6">
                {notification.workspaceName} &ndash; {notification.taskName}
              </Typography>
            </>
          }
          secondary={
            <>
              {notification.message.includes(';') ? (
                (() => {
                  const notif = notification.message.split(';');
                  return (
                    <Box>
                      {notif.map((message, index) => (
                        <Typography key={index} variant="body1" color="textPrimary">
                          {message}
                        </Typography>
                      ))}
                    </Box>
                  );
                })()
              ) : (
                <Typography variant="body1" color="textPrimary">
                  {notification.message}
                </Typography>
              )}

              <Typography variant="caption" color="textSecondary">
                by{' '}
                {notification.creatorName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider component="li" />
    </Box>
  );
};
