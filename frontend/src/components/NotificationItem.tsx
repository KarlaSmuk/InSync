import { Box, Button, Card, CardContent, Divider, ListItem, Typography } from '@mui/material';
import type { NotificationResponse } from '../api/fastAPI.schemas';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { getNotifications } from '../api/notifications/notifications';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: NotificationResponse;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { markNotificationReadApiNotificationsNotificationIdReadPatch } = getNotifications();

  const markReadMutation = useMutation<void, Error, string>({
    mutationFn: (notificationId: string) =>
      markNotificationReadApiNotificationsNotificationIdReadPatch(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const handleClick = () => {
    navigate(`/workspaces/${notification.workspaceId}`);
  };

  return (
    <Box key={notification.id}>
      <ListItem disableGutters sx={{ mb: 1 }}>
        <Card
          elevation={10}
          sx={{
            display: 'flex',
            width: '100%',
            borderRadius: 1,
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={handleClick}>
          <Box sx={{ flex: 1, position: 'relative' }}>
            <CardContent sx={{ p: 1, pb: 0.5, '&:last-child': { pb: 0.5 } }}>
              <Typography variant="caption" color="textSecondary">
                {new Date(notification.notifiedAt).toLocaleString(undefined, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
              <Typography variant="subtitle1" fontWeight="medium">
                {notification.workspaceName} – {notification.taskName}
              </Typography>
              <Box sx={{ pt: 0.5 }}>
                {notification.message.split(';').map((line, idx) => (
                  <Typography key={idx} variant="body2" color="textPrimary">
                    {line}
                  </Typography>
                ))}
              </Box>
              <Typography variant="caption" color="textSecondary">
                by
                {notification.creatorName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </Typography>
            </CardContent>
            {!notification.isRead && (
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  markReadMutation.mutate(notification.id);
                }}
                disabled={markReadMutation.isPending}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  minWidth: 0,
                  padding: '2px 6px',
                  cursor: 'pointer'
                }}>
                {markReadMutation.isPending ? 'Marking…' : 'Mark read'}
              </Button>
            )}
          </Box>
        </Card>
      </ListItem>
      <Divider component="li" sx={{ my: 0.5 }} />
    </Box>
  );
};
