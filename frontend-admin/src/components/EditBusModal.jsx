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
  updateBus,
} from "../services/bus.service";

const EditBusModal = ({
  open,
  handleClose,
  bus,
  refreshBuses,
}) => {

  const [formData, setFormData] =
    useState({
      busNumber: "",
      vehicleNumber: "",
    });

  useEffect(() => {

    if (bus) {

      setFormData({
        busNumber:
          bus.busNumber || "",
        vehicleNumber:
          bus.vehicleNumber || "",
      });

    }

  }, [bus]);

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

        await updateBus(
          bus._id,
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
        Edit Bus
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          label="Bus Number"
          name="busNumber"
          margin="normal"
          value={formData.busNumber}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Vehicle Number"
          name="vehicleNumber"
          margin="normal"
          value={formData.vehicleNumber}
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

export default EditBusModal;