import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";

import {
  createRoute,
} from "../services/route.service";

import CloseIcon from "@mui/icons-material/Close";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const EMPTY_FORM = {
  routeName: "",
  tripType: "PICKUP",
  scheduledTime: "",
  stops: "",
};

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

const AddRouteModal = ({
  open,
  handleClose,
  refreshRoutes,
}) => {

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleDialogClose = () => {
    if (submitting) return; // don't let it close mid-save
    setFormData(EMPTY_FORM);
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

        setFormData(EMPTY_FORM);

        handleClose();

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Unable to add route"
        );

      } finally {

        setSubmitting(false);

      }
    };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: "16px", overflow: "hidden" },
      }}
    >

      {/* =====================================================
          HEADER — brand gradient band with a route icon
          badge, title/subtitle, and a close button. Replaces
          the plain DialogTitle.
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
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
              Add Route
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
              Create a new pickup or drop route
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


        <TextField
          fullWidth
          multiline
          rows={3}
          label="Stops (comma separated)"
          name="stops"
          margin="normal"
          value={formData.stops}
          onChange={handleChange}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography sx={{ fontSize: 13, color: "#ef4444", mt: 1.5 }}>
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
          {submitting ? "Saving..." : "Save"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default AddRouteModal;
