import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

interface UnsavedChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmLeave: () => void;
}

const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  open,
  onClose,
  onConfirmLeave,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText>
          You have unsaved changes. Are you sure you want to leave this page?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirmLeave} color="primary">
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedChangesDialog;
