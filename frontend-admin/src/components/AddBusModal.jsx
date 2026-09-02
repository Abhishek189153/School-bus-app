import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";

import {
  createBus,
} from "../services/bus.service";

import CloseIcon from "@mui/icons-material/Close";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

const EMPTY_FORM = {
  busNumber: "",
  vehicleNumber: "",
};

// Shared visual style for every text field — same rounded,
// soft-bordered look used on the Students/Drivers/Buses tables.
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

const AddBusModal = ({
  open,
  handleClose,
  refreshBuses,
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

        await createBus(
          formData
        );

        refreshBuses();

        setFormData(EMPTY_FORM);

        handleClose();

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Unable to add bus"
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
          HEADER — brand gradient band with a bus icon badge,
          title/subtitle, and a close button. Replaces the
          plain DialogTitle.
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
            <DirectionsBusIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
              Add Bus
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
              Register a new bus for your fleet
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>

        <Typography
          sx={{ fontSize: 12.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.6px", mb: 1.5 }}
        >
          BUS DETAILS
        </Typography>

        <TextField
          fullWidth
          label="Bus Number"
          name="busNumber"
          margin="normal"
          value={formData.busNumber}
          onChange={handleChange}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TagOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Vehicle Number"
          name="vehicleNumber"
          margin="normal"
          value={formData.vehicleNumber}
          onChange={handleChange}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
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

export default AddBusModal;
