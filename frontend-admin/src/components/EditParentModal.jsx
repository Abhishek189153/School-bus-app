import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import {
  useState,
  useEffect,
} from "react";

import {
  updateParent,
} from "../services/parent.service";

const EditParentModal = ({
  open,
  handleClose,
  parent,
  refreshParents,
}) => {

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
    });

  useEffect(() => {

    if (parent) {

      setFormData({
        name: parent.name || "",
        phone: parent.phone || "",
      });

    }

  }, [parent]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit =
    async () => {

      try {

        await updateParent(
          parent._id,
          formData
        );

        refreshParents();

        handleClose();

      } catch (error) {

        alert(
    error.response?.data?.message ||
    "Operation failed"
  );


      }
    };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
    >

      <DialogTitle>
        Edit Parent
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          label="Name"
          name="name"
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
        />

      </DialogContent>

      <DialogActions>

        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Update
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default EditParentModal;