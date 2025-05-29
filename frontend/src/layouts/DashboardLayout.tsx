import {
  Avatar,
  Badge,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getWorkspace } from '../api/workspace/workspace';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getNotifications } from '../api/notifications/notifications';
import { type WorkspaceCreate } from '../api/fastAPI.schemas';
import CreateWorkspaceDialog from '../components/CreateWorkspaceDialog';

const drawerWidth = 240;

export default function DashboardLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useUser();
  const { getWorkspacesByUserApiWorkspaceAllGet, createWorkspaceApiWorkspacePost } = getWorkspace();
  const { countUnreadNotificationsApiNotificationsUnreadCountGet } = getNotifications();
  const [openWorkspaces, setOpenWorkspaces] = useState(false);

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['userWorkspaces'],
    queryFn: getWorkspacesByUserApiWorkspaceAllGet
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['notificationsCount'],
    queryFn: countUnreadNotificationsApiNotificationsUnreadCountGet
  });

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, onClick: () => navigate('/') },
    {
      text: 'Workspaces',
      icon: <WorkspacesIcon />,
      collapsible: true,
      open: openWorkspaces,
      onClick: () => setOpenWorkspaces((prev) => !prev)
    },
    {
      text: 'Notifications',
      icon: <NotificationsIcon />,
      onClick: () => navigate('/notifications')
    }
  ];

  //for workspace create
  // local state for the form
  const [openCreate, setOpenCreate] = useState(false);

  const createWorkspaceMutation = useMutation({
    mutationFn: (payload: WorkspaceCreate) => createWorkspaceApiWorkspacePost(payload),
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['userWorkspaces'] });
      navigate(`/workspaces/${newWorkspace.id}`);
    }
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1f2937',
            color: '#f1f5f9',
            borderRight: 0
          }
        }}>
        <Toolbar sx={{ px: 2, py: 3, bgcolor: '#111827' }}>
          <Typography variant="h5" noWrap sx={{ fontWeight: 'bold', color: '#f1f5f9' }}>
            InSync
          </Typography>
        </Toolbar>
        <List disablePadding>
          {menuItems.map(({ text, icon, onClick, collapsible, open }) => (
            <Box key={text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={onClick}
                  sx={{ px: 3, py: 1.75, '&:hover': { bgcolor: '#374151' } }}>
                  {text == 'Notifications' ? (
                    <ListItemIcon sx={{ color: '#f1f5f9' }}>
                      <Badge
                        badgeContent={unreadCount}
                        color="error"
                        overlap="circular"
                        invisible={unreadCount === 0}>
                        <NotificationsIcon />
                      </Badge>
                    </ListItemIcon>
                  ) : (
                    <ListItemIcon sx={{ color: '#f1f5f9' }}>{icon}</ListItemIcon>
                  )}
                  <ListItemText primary={text} sx={{ ml: 1 }} />
                  {collapsible &&
                    (open ? (
                      <ExpandLessIcon sx={{ color: '#f1f5f9' }} />
                    ) : (
                      <ExpandMoreIcon sx={{ color: '#f1f5f9' }} />
                    ))}
                </ListItemButton>
              </ListItem>

              {collapsible && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {isLoading ? (
                      <ListItem key="loading" disablePadding>
                        <ListItemButton sx={{ pl: 6, py: 1.25, '&:hover': { bgcolor: '#374151' } }}>
                          <ListItemText primary="Loading..." />
                        </ListItemButton>
                      </ListItem>
                    ) : (
                      <>
                        {workspaces?.map((ws) => (
                          <ListItem key={ws.id} disablePadding>
                            <ListItemButton
                              onClick={() => navigate(`/workspaces/${ws.id}`)}
                              sx={{
                                pl: 6,
                                py: 1.25,
                                '&:hover': { bgcolor: '#374151' }
                              }}>
                              <ListItemText primary={ws.name} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => setOpenCreate(true)}
                            sx={{
                              pl: 6,
                              py: 1.25,
                              '&:hover': { bgcolor: '#374151' }
                            }}>
                            <ListItemIcon>
                              <AddIcon sx={{ color: '#f1f5f9' }} />
                            </ListItemIcon>
                            <ListItemText primary="New Workspace" />
                          </ListItemButton>
                        </ListItem>
                        <CreateWorkspaceDialog
                          open={openCreate}
                          loading={createWorkspaceMutation.isPending}
                          onClose={() => setOpenCreate(false)}
                          onCreate={(payload) => createWorkspaceMutation.mutate(payload)}
                        />
                      </>
                    )}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: '#111827'
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40, color: '#ffffff' }}>
              {initials}
            </Avatar>
            <Typography variant="body2" noWrap sx={{ ml: 2, color: '#f1f5f9' }}>
              {user?.fullName}
            </Typography>
          </Box>
          <IconButton onClick={logout} sx={{ color: '#f1f5f9' }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Drawer>

      <Box
        component="main"
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          flexGrow: 1,
          bgcolor: '#f8fafc',
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #ffffff, #e5e7eb)'
        }}>
        <Outlet />
      </Box>
    </Box>
  );
}
