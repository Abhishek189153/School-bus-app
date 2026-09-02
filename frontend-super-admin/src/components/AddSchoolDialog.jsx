import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import {
  useState,
} from "react";

import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import axios
from "../api/axios";

const EMPTY_FORM = {

    // School Details
    schoolName: "",
    address: "",
    phone: "",
    email: "",

    // // School Admin Details
    // adminName: "",
    // adminPhone: "",
    // adminEmail: "",
    // temporaryPassword: "",

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

export default function AddSchoolDialog({
  open,
  onClose,
  onSuccess,
}) {

  const [form, setForm] = useState(EMPTY_FORM);

  const [submitting, setSubmitting] = useState(false);

  const handleChange=(e)=>{

    setForm({

      ...form,

      [e.target.name]:
      e.target.value,

    });

  };


//   const generatePassword = () => {

//     const chars =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

//     let password = "SBM@";

//     for (let i = 0; i < 6; i++) {

//         password += chars.charAt(
//             Math.floor(Math.random() * chars.length)
//         );

//     }

//     setForm((prev) => ({
//         ...prev,
//         temporaryPassword: password,
//     }));

// };

  const handleClose = () => {
    if (submitting) return; // don't let the dialog close mid-save
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit=async()=>{

    try{

      setSubmitting(true);

      await axios.post(
        "/schools",
        form
      );

      onSuccess();

      onClose();

      setForm(EMPTY_FORM);

    }catch(err){

      alert(
        err.response?.data?.message
      );

    }finally{

      setSubmitting(false);

    }

  };

  return(

<Dialog
open={open}
onClose={handleClose}
maxWidth="sm"
fullWidth
PaperProps={{
  sx: { borderRadius: "18px", overflow: "hidden" },
}}
>

{/* =====================================================
    HEADER — brand gradient band with an icon badge, a
    title/subtitle pair, and a close button. Replaces the
    plain DialogTitle for a friendlier first impression.
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
      <SchoolIcon sx={{ fontSize: 22 }} />
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
        Add School
      </Typography>
      <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
        Register a new school on the platform
      </Typography>
    </Box>
  </Box>
</Box>

<DialogContent sx={{ px: 3, py: 3 }}>

<Typography
  sx={{ fontSize: 12.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.6px", mb: 1.5 }}
>
  SCHOOL DETAILS
</Typography>

<Grid
container
spacing={2.5}
>

<Grid item xs={12}>

<TextField

fullWidth

required

label="School Name"

name="schoolName"

value={form.schoolName}

onChange={handleChange}

sx={fieldSx}

InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <SchoolIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
    </InputAdornment>
  ),
}}

/>

</Grid>

<Grid item xs={12}>

<TextField

fullWidth

required

label="Address"

name="address"

value={form.address}

onChange={handleChange}

sx={fieldSx}

InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <LocationOnOutlinedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
    </InputAdornment>
  ),
}}

/>

</Grid>

<Grid item xs={12} sm={6}>

<TextField

fullWidth

required

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

required

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

{/* <Grid item xs={12}>
    <h3>School Admin Information</h3>
</Grid>

<Grid item xs={6}>
    <TextField
        fullWidth
        label="Admin Name"
        name="adminName"
        value={form.adminName}
        onChange={handleChange}
    />
</Grid>

<Grid item xs={6}>
    <TextField
        fullWidth
        label="Admin Phone"
        name="adminPhone"
        value={form.adminPhone}
        onChange={handleChange}
    />
</Grid>

<Grid item xs={12}>
    <TextField
        fullWidth
        label="Admin Email"
        name="adminEmail"
        value={form.adminEmail}
        onChange={handleChange}
    />
</Grid>

<Grid item xs={9}>
    <TextField
        fullWidth
        label="Temporary Password"
        name="temporaryPassword"
        value={form.temporaryPassword}
        onChange={handleChange}
    />
</Grid>

<Grid
    item
    xs={3}
    display="flex"
    alignItems="center"
>

    <Button
        variant="outlined"
        fullWidth
        onClick={generatePassword}
    >
        Generate
    </Button>

</Grid> */}

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

disabled={submitting || !form.schoolName || !form.address || !form.phone || !form.email}

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

{submitting ? "Saving..." : "Save School"}

</Button>

</DialogActions>

</Dialog>

  );

}
