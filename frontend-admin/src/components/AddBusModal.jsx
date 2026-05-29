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
  createBus,
} from "../services/bus.service";

const AddBusModal = ({
  open,
  handleClose,
  refreshBuses,
}) => {

  const [formData, setFormData] =
    useState({
      busNumber: "",
      vehicleNumber: "",
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

        await createBus(
          formData
        );

        refreshBuses();

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
        Add Bus
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          label="Bus Number"
          name="busNumber"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Vehicle Number"
          name="vehicleNumber"
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

export default AddBusModal;