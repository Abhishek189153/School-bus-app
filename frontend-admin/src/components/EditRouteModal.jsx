import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
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
      tripType: "PICKUP",
      scheduledTime: "",
      stops: [],
    });

  useEffect(() => {

    if (route) {

      setFormData({

        routeName:
          route.routeName || "",

        tripType:
          route.tripType || "PICKUP",

        scheduledTime:
          route.scheduledTime || "",

        stops:
          route.stops || [],

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

 const handleStopChange = (
  index,
  field,
  value
) => {

  const updatedStops =
    [...formData.stops];

  updatedStops[index] = {

    ...updatedStops[index],

    [field]: value,

  };

  setFormData({

    ...formData,

    stops:
      updatedStops,

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
            formData.stops.map(
              (stop) => ({

                ...stop,

                latitude:
                  Number(stop.latitude),

                longitude:
                  Number(stop.longitude),

              })
            ),

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
      maxWidth="md"
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

            

        {formData.stops.map(
          (stop, index) => (

            <div
              key={index}
              style={{
                border:
                  "1px solid #ddd",

                borderRadius:
                  "8px",

                padding:
                  "15px",

                marginTop:
                  "15px",
              }}
            >

             

              <TextField
                fullWidth
                label="Stop Name"
                margin="normal"
                value={
                  stop.stopName || ""
                }
                onChange={(e) =>
                  handleStopChange(
                    index,
                    "stopName",
                    e.target.value
                  )
                }
              />

             <TextField
            fullWidth
            label="Latitude"
            type="text"
            margin="normal"
            value={
              stop.latitude ?? ""
            }
            onChange={(e) =>
              handleStopChange(
                index,
                "latitude",
                e.target.value
              )
            }
          />

              <TextField
                fullWidth
                label="Longitude"
                type="text"
                margin="normal"
                value={
                  stop.longitude ?? ""
                }
                onChange={(e) =>
                  handleStopChange(
                    index,
                    "longitude",
                    e.target.value
                  )
                }
              />

            </div>

          )
        )}

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