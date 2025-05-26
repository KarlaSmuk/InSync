import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const drawerWidth = 230;

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useUser();

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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
            backgroundColor: '#1e293b',
            color: 'white'
          }
        }}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          sx={{ height: '100%' }}>
          <Box>
            <Toolbar sx={{ px: 3 }}>
              <Typography variant="h5" noWrap>
                InSync
              </Typography>
            </Toolbar>
            <List>
              {[
                { text: 'Dashboard', icon: <DashboardIcon /> },
                { text: 'Workspaces', icon: <WorkspacesIcon /> },
                { text: 'Tasks', icon: <AssignmentIcon /> },
                { text: 'Notifications', icon: <NotificationsIcon /> }
              ].map(({ text, icon }) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/${text != 'Dashboard' ? text.toLowerCase() : ''}`)}
                    sx={{ px: 3, py: 1.5, '&:hover': { backgroundColor: '#334155' } }}>
                    {icon}
                    <ListItemText primary={text} sx={{ ml: 2 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ px: 3, py: 2 }}>
            <Avatar sx={{ bgcolor: '#38bdf8', width: 40, height: 40 }}>{initials}</Avatar>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {user?.fullName}
            </Typography>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f1f5f9',
          minHeight: '100vh',
          p: 4,
          background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)'
        }}>
        <Outlet />
      </Box>
    </Box>
  );
}
