import { useState, useMemo } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import type {
  WorkspaceMembersCreate,
  WorkspaceResponse,
  UserResponse
} from '../api/fastAPI.schemas';
import { getWorkspace } from '../api/workspace/workspace';
import { getUser } from '../api/user/user';
import { Chip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface WorkspaceMemberSelectorProps {
  workspaceId: string;
}

export default function WorkspaceMemberSelector({ workspaceId }: WorkspaceMemberSelectorProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<UserResponse[]>([]);

  const {
    getWorkspaceMembersApiWorkspaceWorkspaceIdMembersGet,
    addWorkspaceMembersApiWorkspaceMembersPost
  } = getWorkspace();
  const { getUsersApiUserAllGet } = getUser();

  // fetch all users & current members
  const { data: allUsers = [] } = useQuery<UserResponse[]>({
    queryKey: ['allUsers'],
    queryFn: () => getUsersApiUserAllGet()
  });
  const { data: currentMembers = [], isLoading: loadingMembers } = useQuery<UserResponse[]>({
    queryKey: ['workspace', workspaceId, 'members'],
    queryFn: () => getWorkspaceMembersApiWorkspaceWorkspaceIdMembersGet(workspaceId),
    enabled: !!workspaceId
  });

  // which users are not yet members
  const availableUsers = useMemo(
    () => allUsers.filter((u) => !currentMembers.some((m) => m.id === u.id)),
    [allUsers, currentMembers]
  );

  // mutation to add members
  const mutation = useMutation<WorkspaceResponse, Error, WorkspaceMembersCreate>({
    mutationFn: (payload) => addWorkspaceMembersApiWorkspaceMembersPost(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspace', workspaceId, 'members'] });
    }
  });

  const handleOpen = () => {
    setSelected([]);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (selected.length === 0) {
      setOpen(false);
      return;
    }
    mutation.mutate(
      {
        workspaceId,
        userIds: selected.map((u) => u.id)
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelected([]);
        }
      }
    );
  };

  return (
    <>
      <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={handleOpen}>
        Add Members
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Workspace Members</DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {currentMembers.map((u) => (
              <Chip key={u.id} label={u.username} disabled />
            ))}
          </Box>

          <Autocomplete
            multiple
            options={availableUsers}
            getOptionLabel={(u) => u.username}
            value={selected}
            onChange={(e, v) => setSelected(v)}
            filterSelectedOptions
            isOptionEqualToValue={(a, b) => a.id === b.id}
            loading={loadingMembers}
            renderTags={(v, getTagProps) =>
              v.map((u, i) => (
                <Chip label={u.username} size="small" {...getTagProps({ index: i })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search users"
                placeholder="Type to search..."
                fullWidth
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={selected.length === 0}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
