import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

import { useState } from "react";

import {
  createRoute,
} from "../services/route.service";

const AddRouteModal = ({
  open,
  handleClose,
  refreshRoutes,
}) => {

  const [formData, setFormData] =
    useState({
      routeName: "",
      tripType: "PICKUP",
    scheduledTime: "",
      stops: "",
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

       const payload = {

  routeName:
    formData.routeName,

  tripType:
    formData.tripType,

  scheduledTime:
    formData.scheduledTime,

  stops:
    formData.stops
      .split(",")
      .map((stop) => ({
        stopName:
          stop.trim(),
      })),

};

        await createRoute(
          payload
        );

        refreshRoutes();

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
        Add Route
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          label="Route Name"
          name="routeName"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          label="Trip Type"
          name="tripType"
          margin="normal"
          value={formData.tripType}
          onChange={handleChange}
        >

          <MenuItem value="PICKUP">
            PICKUP
          </MenuItem>

          <MenuItem value="DROP">
            DROP
          </MenuItem>

        </TextField>

        <TextField
        fullWidth
        type="time"
        label="Scheduled Time"
        name="scheduledTime"
        margin="normal"
        value={formData.scheduledTime}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
              

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Stops (comma separated)"
          name="stops"
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

export default AddRouteModal;