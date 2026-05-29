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
  updateRoute,
} from "../services/route.service";

const EditRouteModal = ({
  open,
  handleClose,
  route,
  refreshRoutes,
}) => {

  const [formData, setFormData] =
    useState({
      routeName: "",
      stops: "",
    });

  useEffect(() => {

    if (route) {

      setFormData({
        routeName:
          route.routeName || "",

        stops:
          route.stops
            ?.map(
              (s) =>
                s.stopName
            )
            .join(", ") || "",
      });

    }

  }, [route]);

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

          stops:
            formData.stops
              .split(",")
              .map((stop) => ({
                stopName:
                  stop.trim(),
              })),
        };

        await updateRoute(
          route._id,
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
        Edit Route
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          label="Route Name"
          name="routeName"
          margin="normal"
          value={formData.routeName}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Stops"
          name="stops"
          margin="normal"
          value={formData.stops}
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

export default EditRouteModal;