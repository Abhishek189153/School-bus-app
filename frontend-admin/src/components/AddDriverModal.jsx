import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { useState } from "react";

import {
  createDriver,
} from "../services/driver.service";

const AddDriverModal = ({
  open,
  handleClose,
  refreshDrivers,
}) => {

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      password: "",
    });

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

        await createDriver(
          formData
        );

        refreshDrivers();

        handleClose();

      } catch (error) {

        console.log(error);

      }
    };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
    >

      <DialogTitle>
        Add Driver
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          label="Name"
          name="name"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          margin="normal"
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
          Save
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default AddDriverModal;