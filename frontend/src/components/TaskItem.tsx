import { Box, IconButton, Typography } from '@mui/material';
import type { TaskResponse } from '../api/fastAPI.schemas';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { getTask } from '../api/task/task';
import { ConfirmDialog } from './ConfirmDialog';
import { useState } from 'react';

interface TaskItemProps {
  task: TaskResponse;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const qc = useQueryClient();
  const { deleteTaskApiTaskTaskIdDelete } = getTask();
  const [openConfirm, setOpenConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteTaskApiTaskTaskIdDelete(task.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspaceTasks', task.workspaceId] });
    }
  });

  const handleDeleteClick = () => {
    setOpenConfirm(true);
  };

  const handleCancel = () => {
    setOpenConfirm(false);
  };

  const handleConfirm = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <ConfirmDialog
        open={openConfirm}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        isLoading={deleteMutation.isPending}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
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
          {task.assignees
            ?.map((a) =>
              a.fullName
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            )
            .join(', ') || '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {task.dueDate ?? '—'}
        </Typography>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
          disabled={deleteMutation.isPending}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Box />
      </Box>
    </>
  );
};
