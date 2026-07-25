import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDelete({

  open,

  onClose,

  onConfirm,

  title,

}) {

  return (

    <Dialog
      open={open}
      onClose={onClose}
    >

      <DialogTitle>

        Delete School

      </DialogTitle>

      <DialogContent>

        <Typography>

          Are you sure you want to delete

          <b> {title}</b> ?

        </Typography>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>

          Cancel

        </Button>

        <Button

          color="error"

          variant="contained"

          onClick={onConfirm}

        >

          Delete

        </Button>

      </DialogActions>

    </Dialog>

  );

}