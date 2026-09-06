import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import {
  useState,
  useEffect,
} from "react";

import {
  updateRoute,
} from "../services/route.service";

import CloseIcon from "@mui/icons-material/Close";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

// Shared visual style for every text field — same rounded,
// soft-bordered look used on the Students/Drivers/Routes tables.
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    fontSize: "0.875rem",

    "& fieldset": { borderColor: "#cbd5e1" },
    "&:hover fieldset": { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2563eb",
  },
};

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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
// ADD STOP
// =====================================================

const [addStopOpen, setAddStopOpen] = useState(false);

const [newStop, setNewStop] = useState({
  stopName: "",
  latitude: "",
  longitude: "",
});

const [insertPosition, setInsertPosition] = useState("end");

// DELETE STOP CONFIRMATION
const [stopDeleteOpen, setStopDeleteOpen] = useState(false);
const [stopToDelete, setStopToDelete] = useState(null);

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


// =====================================================
// ADD STOP HANDLERS
// =====================================================

const handleNewStopChange = (e) => {
  const { name, value } = e.target;

  setNewStop((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const openAddStopDialog = () => {
  setNewStop({
    stopName: "",
    latitude: "",
    longitude: "",
  });

  setInsertPosition("end");
  setAddStopOpen(true);
};

const closeAddStopDialog = () => {
  if (submitting) return;

  setAddStopOpen(false);

  setNewStop({
    stopName: "",
    latitude: "",
    longitude: "",
  });

  setInsertPosition("end");
};

const handleAddStop = () => {
  if (!newStop.stopName.trim()) {
    return;
  }

  const stopToAdd = {
    stopName: newStop.stopName.trim(),
    latitude:
      newStop.latitude === ""
        ? ""
        : Number(newStop.latitude),
    longitude:
      newStop.longitude === ""
        ? ""
        : Number(newStop.longitude),
  };

  const updatedStops = [...formData.stops];

  if (insertPosition === "beginning") {
    updatedStops.unshift(stopToAdd);
  } else if (insertPosition === "end") {
    updatedStops.push(stopToAdd);
  } else {
    const afterIndex = Number(insertPosition);

    updatedStops.splice(
      afterIndex + 1,
      0,
      stopToAdd
    );
  }

  setFormData((previous) => ({
    ...previous,
    stops: updatedStops,
  }));

  closeAddStopDialog();
};

const handleDeleteStop = (index) => {
  const stop = formData.stops[index];

  setStopToDelete({
    index,
    stopName: stop?.stopName || `Stop ${index + 1}`,
  });

  setStopDeleteOpen(true);
};

const confirmDeleteStop = () => {
  if (!stopToDelete) return;

  const updatedStops = formData.stops.filter(
    (_, stopIndex) => stopIndex !== stopToDelete.index
  );

  setFormData((previous) => ({
    ...previous,
    stops: updatedStops,
  }));

  setStopDeleteOpen(false);
  setStopToDelete(null);
};

const closeStopDeleteDialog = () => {
  setStopDeleteOpen(false);
  setStopToDelete(null);
};

  const handleDialogClose = () => {
    if (submitting) return; // don't let it close mid-save
    setError("");
    handleClose();
  };

  const handleSubmit =
    async () => {

      try {

        setSubmitting(true);
        setError("");

       const payload = {

          routeName:
            formData.routeName,

           tripType:
            formData.tripType,

          scheduledTime:
            formData.scheduledTime,

          // stops:
          //   formData.stops.map(
          //     (stop) => ({

          //       ...stop,

          //       latitude:
          //         Number(stop.latitude),

          //       longitude:
          //         Number(stop.longitude),

          //     })
          //   ),

          stops: formData.stops.map((stop) => ({
  stopName: stop.stopName.trim(),
  ...(stop.latitude !== "" &&
  stop.latitude !== null &&
  stop.latitude !== undefined
    ? { latitude: Number(stop.latitude) }
    : {}),
  ...(stop.longitude !== "" &&
  stop.longitude !== null &&
  stop.longitude !== undefined
    ? { longitude: Number(stop.longitude) }
    : {}),
})),

        };

        await updateRoute(
          route._id,
          payload
        );

        refreshRoutes();

        handleClose();

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Unable to update route"
        );

      } finally {

        setSubmitting(false);

      }

    };

  if (!route) return null;

  return (
      <>
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: "16px", overflow: "hidden" },
      }}
    >

      {/* =====================================================
          HEADER — brand gradient band with a route icon
          badge, the route name as the subtitle, and a close
          button. Replaces the plain DialogTitle.
      ===================================================== */}

      <Box
        sx={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "#fff",
          px: 3,
          py: 2.5,
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleDialogClose}
          disabled={submitting}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "rgba(255,255,255,0.85)",
            "&:hover": { background: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <AltRouteIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
              Edit Route
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, opacity: 0.9 }}>
              Updating {route.routeName || "this route"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>

        <Typography
          sx={{ fontSize: 12.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.6px", mb: 1.5 }}
        >
          ROUTE DETAILS
        </Typography>

        <TextField
          fullWidth
          label="Route Name"
          name="routeName"
          margin="normal"
          value={formData.routeName}
          onChange={handleChange}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AltRouteIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
        select
        fullWidth
        label="Trip Type"
        name="tripType"
        margin="normal"
        value={formData.tripType}
        onChange={handleChange}
        sx={fieldSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SwapVertOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
            </InputAdornment>
          ),
        }}
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
        sx={fieldSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccessTimeOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
            </InputAdornment>
          ),
        }}
      />

      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mt: 3,
    mb: 1.5,
  }}
>
  <Typography
    sx={{
      fontSize: 12.5,
      fontWeight: 800,
      color: "#94a3b8",
      letterSpacing: "0.6px",
    }}
  >
    STOPS
  </Typography>

  <Button
    variant="outlined"
    size="small"
    startIcon={<AddOutlinedIcon />}
    onClick={openAddStopDialog}
    disabled={submitting}
    sx={{
      borderColor: "#2563eb",
      color: "#2563eb",
      fontWeight: 700,
      textTransform: "none",
      borderRadius: "9px",
      px: 1.5,
      "&:hover": {
        borderColor: "#1d4ed8",
        backgroundColor: "#eff6ff",
      },
    }}
  >
    Add Stop
  </Button>
</Box>

        {formData.stops.map(
          (stop, index) => (

            <Box
              key={index}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                p: 2,
                mb: 2,
                backgroundColor: "#f8fafc",
              }}
            >

              <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 0.5,
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.75,
    }}
  >
    <LocationOnOutlinedIcon
      sx={{
        fontSize: 17,
        color: "#2563eb",
      }}
    />

    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 700,
        color: "#334155",
      }}
    >
      Stop {index + 1}
    </Typography>
  </Box>

  <IconButton
    size="small"
    onClick={() => handleDeleteStop(index)}
    disabled={submitting}
    sx={{
      color: "#ef4444",
      "&:hover": {
        backgroundColor: "#fef2f2",
      },
    }}
  >
    <DeleteOutlineOutlinedIcon fontSize="small" />
  </IconButton>
</Box>

              <TextField
                fullWidth
                label="Stop Name"
                margin="dense"
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
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="text"
                    margin="dense"
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
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MyLocationOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="text"
                    margin="dense"
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
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MyLocationOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

            </Box>

          )
        )}

        {error && (
          <Typography sx={{ fontSize: 13, color: "#ef4444", mt: 1 }}>
            {error}
          </Typography>
        )}

      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: "1px solid #e2e8f0",
          gap: 1,
        }}
      >

        <Button
          onClick={handleDialogClose}
          disabled={submitting}
          sx={{
            color: "#64748b",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 2.5,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : null}
          sx={{
            background: "#2563eb",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
            boxShadow: "0 4px 12px rgba(37,99,235,0.25)",

            "&:hover": {
              background: "#1d4ed8",
              boxShadow: "0 6px 16px rgba(37,99,235,0.32)",
            },

            "&.Mui-disabled": {
              background: "#93c5fd",
              color: "#fff",
            },
          }}
        >
          {submitting ? "Updating..." : "Update"}
        </Button>

      </DialogActions>

      {/* =====================================================
    ADD STOP DIALOG
===================================================== */}

<Dialog
  open={addStopOpen}
  onClose={closeAddStopDialog}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: "16px",
      overflow: "hidden",
    },
  }}
>
  <Box
    sx={{
      background:
        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "#fff",
      px: 3,
      py: 2.5,
      position: "relative",
    }}
  >
    <IconButton
      onClick={closeAddStopDialog}
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        color: "rgba(255,255,255,0.85)",
        "&:hover": {
          background: "rgba(255,255,255,0.15)",
        },
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          background: "rgba(255,255,255,0.15)",
        }}
      >
        <LocationOnOutlinedIcon />
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 19,
          }}
        >
          Add Stop
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            opacity: 0.9,
          }}
        >
          Choose where this stop should be placed
        </Typography>
      </Box>
    </Box>
  </Box>

  <DialogContent sx={{ px: 3, py: 3 }}>
    <TextField
      fullWidth
      label="Stop Name"
      name="stopName"
      margin="normal"
      value={newStop.stopName}
      onChange={handleNewStopChange}
      sx={fieldSx}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationOnOutlinedIcon
              sx={{
                fontSize: 19,
                color: "#94a3b8",
              }}
            />
          </InputAdornment>
        ),
      }}
    />

    <Grid container spacing={1.5}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Latitude"
          name="latitude"
          type="text"
          inputMode="decimal"
          margin="normal"
          value={newStop.latitude}
          onChange={handleNewStopChange}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MyLocationOutlinedIcon
                  sx={{
                    fontSize: 19,
                    color: "#94a3b8",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Longitude"
          name="longitude"
          type="text"
          inputMode="decimal"
          margin="normal"
          value={newStop.longitude}
          onChange={handleNewStopChange}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MyLocationOutlinedIcon
                  sx={{
                    fontSize: 19,
                    color: "#94a3b8",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>

    <TextField
      select
      fullWidth
      label="Insert Stop"
      name="insertPosition"
      margin="normal"
      value={insertPosition}
      onChange={(e) =>
        setInsertPosition(e.target.value)
      }
      sx={fieldSx}
    >
      <MenuItem value="beginning">
        Beginning
      </MenuItem>

      {formData.stops.map((stop, index) => (
        <MenuItem
          key={stop._id || `position-${index}`}
          value={String(index)}
        >
          After Stop {index + 1}
          {stop.stopName
            ? ` — ${stop.stopName}`
            : ""}
        </MenuItem>
      ))}

      <MenuItem value="end">
        End
      </MenuItem>
    </TextField>
  </DialogContent>

  <DialogActions
    sx={{
      px: 3,
      py: 2.5,
      borderTop: "1px solid #e2e8f0",
      gap: 1,
    }}
  >
    <Button
      onClick={closeAddStopDialog}
      sx={{
        color: "#64748b",
        fontWeight: 700,
        textTransform: "none",
        borderRadius: "10px",
        px: 2.5,
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleAddStop}
      disabled={!newStop.stopName.trim()}
      startIcon={<AddOutlinedIcon />}
      sx={{
        background: "#2563eb",
        fontWeight: 700,
        textTransform: "none",
        borderRadius: "10px",
        px: 3,

        "&:hover": {
          background: "#1d4ed8",
        },

        "&.Mui-disabled": {
          background: "#93c5fd",
          color: "#fff",
        },
      }}
    >
      Add Stop
    </Button>
  </DialogActions>
</Dialog>



    </Dialog>

     <ConfirmDeleteDialog
      open={stopDeleteOpen}
      onClose={closeStopDeleteDialog}
      onConfirm={confirmDeleteStop}
      entityLabel="stop"
      itemName={stopToDelete?.stopName}
    />

  </>

  );

};

export default EditRouteModal;
