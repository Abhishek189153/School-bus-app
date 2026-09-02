import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
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

import axios from "../api/axios";

import {
  createSchoolAdmin,
} from "../services/schoolAdmin.service";

import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SchoolIcon from "@mui/icons-material/School";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const EMPTY_FORM = {

  schoolId: "",

  name: "",

  phone: "",

  email: "",

  password: "",

};

// Shared visual style for every text field — keeps the rounded,
// soft-bordered look consistent with the rest of the app.
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f8fafc",

    "& fieldset": {
      borderColor: "#e2e8f0",
    },

    "&:hover fieldset": {
      borderColor: "#cbd5e1",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#2563EB",
      borderWidth: "1px",
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2563EB",
  },
};

export default function AddSchoolAdminDialog({
  open,
  onClose,
  onSuccess,
}) {

  const [schools, setSchools] = useState([]);

  const [schoolsLoading, setSchoolsLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {

    if (open) {

      loadSchools();

    }

  }, [open]);

  const loadSchools = async () => {

    try {

      setSchoolsLoading(true);

      const res = await axios.get("/schools");

      setSchools(res.data.schools);

    } catch (err) {

      console.log(err);

    } finally {

      setSchoolsLoading(false);

    }

  };

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };

  const generatePassword = () => {

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

    let password = "SBM@";

    for (let i = 0; i < 6; i++) {

      password += chars.charAt(

        Math.floor(
          Math.random() * chars.length
        )

      );

    }

    setForm({

      ...form,

      password,

    });

  };

  const handleClose = () => {
    if (submitting) return; // don't let the dialog close mid-save
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = async () => {

    try {

      setSubmitting(true);

      await createSchoolAdmin(form);

      onSuccess();

      onClose();

      setForm(EMPTY_FORM);

    } catch (err) {

      alert(

        err.response?.data?.message ||

        "Unable to create School Admin"

      );

    } finally {

      setSubmitting(false);

    }

  };

  return (

    <Dialog

      open={open}

      onClose={handleClose}

      fullWidth

      maxWidth="sm"

      PaperProps={{
        sx: { borderRadius: "18px", overflow: "hidden" },
      }}

    >

      {/* =====================================================
          HEADER — brand gradient band with an admin icon
          badge, title/subtitle, and a close button. Replaces
          the plain DialogTitle.
      ===================================================== */}

      <Box
        sx={{
          background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
          color: "#fff",
          px: 3,
          py: 2.5,
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleClose}
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
            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
              Add School Admin
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
              Create an admin account for a school
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>

        <Typography
          sx={{ fontSize: 12.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.6px", mb: 1.5 }}
        >
          ADMIN DETAILS
        </Typography>

        <Grid

          container

          spacing={2.5}

        >

          <Grid item xs={12}>

            <TextField

              select

              fullWidth

              label="School"

              name="schoolId"

              value={form.schoolId}

              onChange={handleChange}

              sx={fieldSx}

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}

              SelectProps={{
                displayEmpty: true,
                renderValue: (value) => {
                  if (schoolsLoading) return "Loading schools...";
                  if (!value) return "Select a school";
                  const match = schools.find((s) => s._id === value);
                  return match ? match.schoolName : "Select a school";
                },
              }}

            >

              {

                schools.map(

                  (school) => (

                    <MenuItem

                      key={school._id}

                      value={school._id}

                    >

                      {school.schoolName}

                    </MenuItem>

                  )

                )

              }

            </TextField>

          </Grid>

          <Grid item xs={12}>

            <TextField

              fullWidth

              label="Admin Name"

              name="name"

              value={form.name}

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

          </Grid>

          <Grid item xs={12} sm={6}>

            <TextField

              fullWidth

              label="Phone"

              name="phone"

              value={form.phone}

              onChange={handleChange}

              sx={fieldSx}

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}

            />

          </Grid>

          <Grid item xs={12} sm={6}>

            <TextField

              fullWidth

              type="email"

              label="Email"

              name="email"

              value={form.email}

              onChange={handleChange}

              sx={fieldSx}

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}

            />

          </Grid>

          <Grid item xs={12} sm={8}>

            <TextField

              fullWidth

              label="Temporary Password"

              name="password"

              value={form.password}

              onChange={handleChange}

              sx={fieldSx}

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}

            />

          </Grid>

          <Grid

            item

            xs={12}

            sm={4}

          >

            <Button

              fullWidth

              variant="outlined"

              startIcon={<AutorenewIcon sx={{ fontSize: 18 }} />}

              onClick={generatePassword}

              sx={{
                height: "100%",
                minHeight: 44,
                borderRadius: "10px",
                borderColor: "#e2e8f0",
                color: "#2563EB",
                fontWeight: 700,
                textTransform: "none",

                "&:hover": {
                  borderColor: "#2563EB",
                  background: "#eff6ff",
                },
              }}

            >

              Generate

            </Button>

          </Grid>

        </Grid>

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

          onClick={handleClose}

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
            background: "#2563EB",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
            boxShadow: "0 4px 12px rgba(37,99,235,0.25)",

            "&:hover": {
              background: "#1D4ED8",
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

}
