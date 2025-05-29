import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { WorkspaceStatusEnum, type WorkspaceCreate } from '../api/fastAPI.schemas';

interface NewWorkspaceDialogProps {
  open: boolean;
  loading: boolean;
  onCreate: (payload: WorkspaceCreate) => void;
  onClose: () => void;
}

export default function CreateWorkspaceDialog({
  open,
  loading,
  onCreate,
  onClose
}: NewWorkspaceDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<WorkspaceStatusEnum>(WorkspaceStatusEnum.ACTIVE);

  const statusOptions = Object.values(WorkspaceStatusEnum);

  const isValid = name.trim() !== '' && description.trim() !== '';

  const handleCreate = () => {
    if (!isValid) return;
    onCreate({
      name: name.trim(),
      description: description.trim(),
      status: status
    });
    onClose();
    setName('');
    setDescription('');
    setStatus(WorkspaceStatusEnum.ACTIVE);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1E1E1E' }}>New Workspace</DialogTitle>
      <DialogContent dividers sx={{ bgcolor: '#1E1E1E' }}>
        <TextField
          autoFocus
          margin="normal"
          label="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <TextField
          margin="normal"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <TextField
          margin="normal"
          label="Status"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value as WorkspaceStatusEnum)}
          fullWidth>
          {statusOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ bgcolor: '#1E1E1E' }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!isValid || loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
