import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          color="error"
          disabled={isLoading}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
