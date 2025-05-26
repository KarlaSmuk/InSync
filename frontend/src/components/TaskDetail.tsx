// src/components/TaskDetail.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  TaskResponse,
  TaskUpdate,
  UserResponse,
  WorkspaceStatusResponse
} from '../api/fastAPI.schemas';
import { getTask } from '../api/task/task';
import { getUser } from '../api/user/user';

interface TaskDetailProps {
  open: boolean;
  task: TaskResponse | null;
  statuses: WorkspaceStatusResponse[];
  onClose: () => void;
}

export const TaskDetail = ({ open, task, statuses, onClose }: TaskDetailProps) => {
  const qc = useQueryClient();
  const { updateTaskApiTaskTaskIdPut } = getTask();
  const { getUsersApiUserAllGet } = getUser();

  // fetch all users
  const { data: allUsers = [], isLoading: usersLoading } = useQuery<UserResponse[]>({
    queryKey: ['allUsers'],
    queryFn: getUsersApiUserAllGet
  });

  const updateTask = useMutation({
    mutationFn: ({ taskId, body }: { taskId: string; body: TaskUpdate }) =>
      updateTaskApiTaskTaskIdPut(taskId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspaceTasks', task?.workspaceId] });
      onClose();
    }
  });

  // local state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [currentAssignees, setCurrentAssignees] = useState<UserResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // sync incoming task
  useEffect(() => {
    if (!task) return;
    setTitle(task.title ?? '');
    setDescription(task.description ?? '');
    setStatusId(task.status?.id ?? '');
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);

    const initial = (task.assignees ?? [])
      .map((assignee) =>
        typeof assignee === 'string'
          ? allUsers.find((u) => u.id === assignee)
          : allUsers.find((u) => u.id === assignee.id)
      )
      .filter((u): u is UserResponse => Boolean(u));
    setCurrentAssignees(initial);
    setSearchQuery('');
  }, [task, allUsers]);

  // filtered users matching query & not already assigned
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allUsers
      .filter(
        (u) =>
          !currentAssignees.some((ca) => ca.id === u.id) &&
          (u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [allUsers, currentAssignees, searchQuery]);

  const handleAddAssignee = (u: UserResponse) => {
    setCurrentAssignees((prev) => {
      if (prev.some((x) => x.id === u.id)) return prev;
      return [...prev, u];
    });
    setSearchQuery('');
  };

  const handleRemoveAssignee = (id: string) => {
    setCurrentAssignees((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSave = () => {
    if (!task) return;
    const body: Partial<TaskUpdate> = {};
    if (title) body.title = title;
    if (description) body.description = description;
    if (statusId) body.statusId = statusId;
    body.dueDate = dueDate ? dueDate.toISOString() : null;
    // send full list of assignees
    body.assignees = currentAssignees.map((u) => u.id);

    updateTask.mutate({ taskId: task.id, body: body as TaskUpdate });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ position: 'relative' }}>
        Edit Task
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={statusId}
              label="Status"
              onChange={(e) => setStatusId(e.target.value)}>
              {statuses.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" alignItems="center" gap={2}>
              <DatePicker
                label="Due Date"
                format="yyyy-MM-dd"
                value={dueDate}
                onChange={(d) => setDueDate(d)}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <Button onClick={() => setDueDate(null)}>Clear</Button>
            </Box>
          </LocalizationProvider>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Assignees
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {currentAssignees.map((u) => (
                <Chip
                  key={u.id}
                  label={u.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                  onDelete={() => handleRemoveAssignee(u.id)}
                />
              ))}
            </Box>
          </Box>

          {usersLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                label="Search users by username or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
              {filteredUsers.length > 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: 200,
                    overflowY: 'auto',
                    zIndex: (theme) => theme.zIndex.modal,
                    mt: 1
                  }}>
                  <List dense>
                    {filteredUsers.map((u) => (
                      <ListItem key={u.id} disablePadding>
                        <ListItemButton onClick={() => handleAddAssignee(u)}>
                          <ListItemText primary={u.fullName} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          )}

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={updateTask.isPending}>
          {updateTask.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
