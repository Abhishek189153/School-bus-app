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
  updateDriver,
} from "../services/driver.service";

const EditDriverModal = ({
  open,
  handleClose,
  driver,
  refreshDrivers,
}) => {

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
    });

  useEffect(() => {

    if (driver) {

      setFormData({
        name: driver.name || "",
        phone: driver.phone || "",
      });

    }

  }, [driver]);

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

        await updateDriver(
          driver._id,
          formData
        );

        refreshDrivers();

        handleClose();

      } catch (error) {

  alert(
    error.response?.data?.message ||
    "Failed to update driver"
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
        Edit Driver
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

        <Button onClick={handleClose}>
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

export default EditDriverModal;