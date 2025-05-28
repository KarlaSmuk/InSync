import { useState, useEffect, useMemo } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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
  ListItemButton,
  ListItemText,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  TaskResponse,
  TaskUpdate,
  UserResponse,
  WorkspaceStatusResponse
} from '../api/fastAPI.schemas';
import { getTask } from '../api/task/task';
import { useUser } from '../hooks/useUser';
import { getWorkspace } from '../api/workspace/workspace';

interface TaskDetailProps {
  open: boolean;
  task: TaskResponse | null;
  statuses: WorkspaceStatusResponse[];
  onClose: () => void;
  workspaceId: string;
}

export const TaskDetail = ({ open, task, statuses, onClose, workspaceId }: TaskDetailProps) => {
  const qc = useQueryClient();
  const { updateTaskApiTaskTaskIdPut } = getTask();
  const { user: currentUser } = useUser();
  const { getWorkspaceMembersApiWorkspaceWorkspaceIdMembersGet } = getWorkspace();
  const { data: allMembers = [] } = useQuery<UserResponse[]>({
    queryKey: ['allMembers', workspaceId],
    queryFn: () => getWorkspaceMembersApiWorkspaceWorkspaceIdMembersGet(workspaceId)
  });

  const updateTask = useMutation({
    mutationFn: ({ taskId, body }: { taskId: string; body: TaskUpdate }) =>
      updateTaskApiTaskTaskIdPut(taskId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspaceTasks', task?.workspaceId] });
      onClose();
    }
  });

  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignees, setAssignees] = useState<UserResponse[]>([]);
  const [search, setSearch] = useState('');

  //default values
  useEffect(() => {
    if (!task) return;

    setTitle(task.title || '');
    setDescription(task.description || '');
    setStatusId(task.status?.id || '');
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);

    const initAssignees: UserResponse[] = (task.assignees || [])
      .map((assignee) => allMembers.find((user: UserResponse) => user.id === assignee.id))
      .filter((user): user is UserResponse => user !== undefined);

    setAssignees(initAssignees ?? []);
  }, [task, allMembers]);

  const filtered = useMemo(() => {
    const userSearch = search.trim().toLowerCase();
    if (!userSearch) return [];
    return allMembers
      .filter(
        (user) =>
          !assignees.some((assignee) => assignee.id === user.id) &&
          (user.username.toLowerCase().includes(userSearch) ||
            user.email.toLowerCase().includes(userSearch))
      )
      .slice(0, 8); //to stay inside screen if user want to find specific it will enter entire username or email
  }, [allMembers, assignees, search]);

  const addAssignee = (user: UserResponse) => {
    setAssignees((prev) => [...prev, user]);
    setSearch('');
  };

  const removeAssignee = (id: string) =>
    setAssignees((prev) => prev.filter((user) => user.id !== id));

  const handleSave = () => {
    if (!task) return;
    const body: Partial<TaskUpdate> = {
      title,
      description,
      statusId,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
      assignees: assignees.map((user: UserResponse) => user.id)
    };
    updateTask.mutate({ taskId: task.id, body: body as TaskUpdate });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0', px: 3, py: 1.5 }}>
        <Typography fontSize={'24px'}>Edit Task</Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: '#E0E0E0' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#1E1E1E', px: 3, py: 2 }}>
        <DialogContent
          sx={{
            bgcolor: '#1E1E1E',
            px: 3,
            py: 2
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3
            }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="filled"
                  fullWidth
                  sx={{
                    bgcolor: '#2C2C2C',
                    '& .MuiFilledInput-input': { color: '#E0E0E0' },
                    '& .MuiInputLabel-root': { color: '#A0A0A0' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2979FF' }
                  }}
                />

                <FormControl fullWidth variant="filled">
                  <InputLabel sx={{ color: '#A0A0A0' }}>Status</InputLabel>
                  <Select
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                    sx={{ bgcolor: '#2C2C2C', color: '#E0E0E0' }}>
                    {statuses.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Date"
                    value={dueDate}
                    onChange={(d) => setDueDate(d)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'filled',
                        sx: {
                          bgcolor: '#2C2C2C',
                          '& .MuiFilledInput-input': { color: '#E0E0E0' },
                          '& .MuiInputLabel-root': { color: '#A0A0A0' }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#A0A0A0', mb: 1 }}>
                    Assignees
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {assignees.map((assignee: UserResponse) => (
                      <Chip
                        key={assignee.id}
                        label={assignee.fullName
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                        onDelete={() => removeAssignee(assignee.id)}
                        sx={{ bgcolor: '#2C2C2C', color: '#E0E0E0' }}
                      />
                    ))}
                  </Box>
                  {currentUser && !assignees.some((a) => a.id === currentUser.id) && (
                    <Button
                      size="small"
                      startIcon={<PersonAddIcon />}
                      onClick={() => addAssignee(currentUser)}
                      sx={{ textTransform: 'none', color: '#2979FF' }}>
                      Assign to me
                    </Button>
                  )}
                  <TextField
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    variant="standard"
                    fullWidth
                    sx={{ mt: 1, color: '#E0E0E0' }}
                    autoComplete="off"
                  />
                  {filtered.length > 0 && (
                    <Paper sx={{ maxHeight: 160, overflow: 'auto', mt: 1, bgcolor: '#2C2C2C' }}>
                      <List dense>
                        {filtered.map((user: UserResponse) => (
                          <ListItemButton key={user.id} onClick={() => addAssignee(user)}>
                            <ListItemText primary={user.fullName} sx={{ color: '#E0E0E0' }} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
              <Typography variant="subtitle2" sx={{ color: '#A0A0A0', mb: 1 }}>
                Description
              </Typography>
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="filled"
                fullWidth
                multiline
                rows={16}
                sx={{
                  flex: 1,
                  bgcolor: '#2C2C2C',
                  '& .MuiFilledInput-input': { color: '#E0E0E0' },
                  '& .MuiInputLabel-root': { color: '#A0A0A0' }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
      </DialogContent>

      <DialogActions sx={{ bgcolor: '#323232', px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: '#aaa' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updateTask.isPending}
          sx={{ bgcolor: '#1e88e5' }}>
          {updateTask.isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
