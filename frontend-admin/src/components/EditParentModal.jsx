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

import {
  useState,
  useEffect,
} from "react";

import {
  updateParent,
} from "../services/parent.service";

import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

// Shared visual style for every text field — same rounded,
// soft-bordered look used on the Students/Drivers/Parents tables.
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


const EditParentModal = ({
  open,
  handleClose,
  parent,
  refreshParents,
}) => {

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
    });

  const [submitting, setSubmitting] = useState(false);


  // ==========================================
  // LOAD PARENT DATA
  // ==========================================

  useEffect(() => {

    if (parent) {

      setFormData({

        name:
          parent.name || "",

        email:
          parent.email || "",

        phone:
          parent.phone || "",

      });

    }

  }, [parent]);


  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        name === "email"
          ? value.toLowerCase()
          : value,

    }));

  };


  // ==========================================
  // CLOSE
  // ==========================================

  const handleDialogClose = () => {
    if (submitting) return; // don't let it close mid-save
    handleClose();
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit =
    async () => {

      // Basic validation

      if (
        !formData.name.trim()
      ) {

        alert(
          "Parent name is required"
        );

        return;

      }


      if (
        !formData.email.trim()
      ) {

        alert(
          "Email is required"
        );

        return;

      }


      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email.trim()
        )
      ) {

        alert(
          "Enter a valid email address"
        );

        return;

      }


      if (
        !/^\d{10}$/.test(
          formData.phone.trim()
        )
      ) {

        alert(
          "Enter a valid 10-digit phone number"
        );

        return;

      }


      try {

        setSubmitting(true);

        await updateParent(
          parent._id,
          formData
        );

        refreshParents();

        handleClose();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Operation failed"
        );

      } finally {

        setSubmitting(false);

      }

    };


  if (!parent) return null;


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
          HEADER — brand gradient band with a parent icon
          badge, the parent's name as the subtitle, and a
          close button. Replaces the plain DialogTitle.
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
            <GroupsIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
              Edit Parent
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, opacity: 0.9 }}>
              Updating {parent.name || "this parent"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>

        <Typography
          sx={{ fontSize: 12.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.6px", mb: 1.5 }}
        >
          PARENT DETAILS
        </Typography>

        {/* NAME */}

        <TextField
          fullWidth
          label="Name"
          name="name"
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />


        {/* EMAIL */}

        <TextField
          fullWidth
          type="email"
          label="Email"
          name="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          helperText="Used for password recovery"
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />


        {/* PHONE */}

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
          inputProps={{
            maxLength: 10,
            inputMode: "numeric",
          }}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />

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

    </Dialog>

  );

};


export default EditParentModal;
