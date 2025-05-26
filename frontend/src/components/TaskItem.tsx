import { Box, Typography } from '@mui/material';
import type { TaskResponse } from '../api/fastAPI.schemas';

interface TaskItemProps {
  task: TaskResponse;
}

export const TaskItem = ({ task }: TaskItemProps) => (
  <Box
    display="grid"
    gridTemplateColumns="3fr 2fr 2fr 1fr"
    alignItems="center"
    py={1}
    px={2}
    sx={{
      fontSize: 14,
      color: '#334155',
      borderBottom: '1px solid #E9ECEF',
      '&:hover': { backgroundColor: '#F8F9FA' }
    }}>
    <Typography>{task.title}</Typography>
    <Typography variant="body2" color="text.secondary">
      {task.assignees?.map((a) => a.fullName).join(', ') || '—'}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {task.dueDate ?? '—'}
    </Typography>
    <Box />
  </Box>
);
