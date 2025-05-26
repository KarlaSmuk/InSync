// src/pages/Workspace.tsx
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, CircularProgress, Alert, TextField, Button } from '@mui/material';
import { getWorkspace } from '../api/workspace/workspace';
import { getTask } from '../api/task/task';
import { useUser } from '../hooks/useUser';
import { useState } from 'react';
import { TaskItem } from '../components/TaskItem';
import type { TaskResponse } from '../api/fastAPI.schemas';
import { TaskDetail } from '../components/TaskDetail';

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const {
    getWorkspaceByIdApiWorkspaceWorkspaceIdGet,
    getTasksByWorkspaceApiWorkspaceWorkspaceIdTasksGet,
    getWorkspaceStatusesApiWorkspaceWorkspaceIdStatusesGet
  } = getWorkspace();
  const { createTaskApiTaskPost } = getTask();

  const [addingStatusId, setAddingStatusId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);

  const {
    data: workspace,
    isLoading: isWorkspaceLoading,
    error: workspaceError
  } = useQuery({
    queryKey: ['workspace', id],
    queryFn: () => getWorkspaceByIdApiWorkspaceWorkspaceIdGet(id!),
    enabled: Boolean(id)
  });

  const {
    data: tasks,
    isLoading: isTasksLoading,
    error: tasksError
  } = useQuery({
    queryKey: ['workspaceTasks', id],
    queryFn: () => getTasksByWorkspaceApiWorkspaceWorkspaceIdTasksGet(id!),
    enabled: Boolean(id)
  });

  const {
    data: statuses,
    isLoading: isStatusesLoading,
    error: statusesError
  } = useQuery({
    queryKey: ['workspaceStatuses', id],
    queryFn: () => getWorkspaceStatusesApiWorkspaceWorkspaceIdStatusesGet(id!),
    enabled: Boolean(id)
  });

  const createTaskMutation = useMutation({
    mutationFn: createTaskApiTaskPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceTasks', id] });
      setAddingStatusId(null);
      setNewTaskTitle('');
    },
    onError: (err) => {
      console.error('Failed to create task:', err);
    }
  });

  function handleCreateTask(statusId: string) {
    console.log('Creating task with statusId:', statusId);
    if (!newTaskTitle.trim() || !user || !workspace) return;

    createTaskMutation.mutate({
      title: newTaskTitle.trim(),
      description: undefined,
      dueDate: undefined,
      workspaceId: workspace.id,
      statusId,
      assignees: [user.id.toString()]
    });
  }

  if (isWorkspaceLoading || isTasksLoading || isStatusesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (workspaceError || tasksError || statusesError) {
    return <Alert severity="error">Could not load workspace or related data.</Alert>;
  }

  // group tasks by status
  const tasksByStatus: Record<string, typeof tasks> = {};
  tasks?.forEach((task) => {
    const sid = task.status?.id;
    if (!sid) return;
    if (!tasksByStatus[sid]) tasksByStatus[sid] = [];
    tasksByStatus[sid].push(task);
  });

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          p: 4,
          bgcolor: '#FFFFFF',
          boxShadow: 3
        }}>
        <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
          {workspace?.name}
        </Typography>

        <Box display="flex" flexDirection="column" gap={6} mt={4}>
          {statuses?.map((status) => {
            const isInProgress = status.name === 'In Progress';
            const headerBg = isInProgress ? '#E5F6FD' : '#E6FFED';
            const headerColor = isInProgress ? '#007BFF' : '#28A745';
            const count = tasksByStatus[status.id]?.length || 0;

            return (
              <Box
                key={status.id}
                sx={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                {/* Status Header */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  px={2}
                  py={1}>
                  <Typography variant="subtitle1" fontWeight={600} color="#334155">
                    {status.name} ({count})
                  </Typography>
                </Box>
                {/* Column Headers */}
                <Box
                  display="grid"
                  gridTemplateColumns="3fr 2fr 2fr 1fr"
                  alignItems="center"
                  py={1}
                  px={2}
                  sx={{
                    backgroundColor: headerBg,
                    color: headerColor,
                    borderBottom: '1px solid #E9ECEF',
                    fontWeight: 600,
                    fontSize: 14
                  }}>
                  <Box>Name</Box>
                  <Box>Assignees</Box>
                  <Box>Due date</Box>
                </Box>

                {tasksByStatus[status.id]?.map((task) => (
                  <Box
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    sx={{ cursor: 'pointer' }}>
                    <TaskItem task={task} />
                  </Box>
                ))}

                {count === 0 && addingStatusId !== status.id && (
                  <Box py={2} px={2}>
                    <Typography variant="body2" color="text.secondary">
                      No tasks.
                    </Typography>
                  </Box>
                )}

                {addingStatusId === status.id ? (
                  <Box
                    display="grid"
                    gridTemplateColumns="3fr 2fr 2fr 1fr"
                    alignItems="center"
                    py={1}
                    px={2}
                    sx={{
                      fontSize: 14,
                      color: '#334155',
                      backgroundColor: '#FFFFFF',
                      borderBottom: '1px solid #E9ECEF'
                    }}>
                    <TextField
                      variant="standard"
                      placeholder="Task name…"
                      fullWidth
                      onBlur={() => setAddingStatusId(null)}
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateTask(status.id)}
                      autoFocus
                      sx={{
                        '& input': { fontSize: 14, color: '#1e293b' }
                      }}
                    />
                    <Box />
                    <Box />
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        size="small"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleCreateTask(status.id)}>
                        Save
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    display="grid"
                    gridTemplateColumns="3fr 2fr 2fr 1fr"
                    alignItems="center"
                    py={1}
                    px={2}
                    sx={{
                      color: 'text.secondary',
                      cursor: 'pointer',
                      borderBottom: '1px solid #E9ECEF'
                    }}
                    onClick={() => {
                      setAddingStatusId(status.id);
                      setNewTaskTitle('');
                    }}>
                    <Typography fontSize={'12px'} sx={{ '&:hover': { opacity: 0.7 } }}>
                      + Add Task
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      <TaskDetail
        task={selectedTask}
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        statuses={statuses || []}
      />
    </>
  );
}
