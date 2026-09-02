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
useEffect,
} from "react";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import axios
from "../api/axios";

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

export default function EditSchoolDialog({

open,

school,

onClose,

onSuccess,

}){

const [form,setForm]=
useState({});

const [submitting,setSubmitting]=
useState(false);

useEffect(()=>{

if(school){

setForm(school);

}

},[school]);

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:
e.target.value,

});

};

const handleClose = () => {
  if (submitting) return; // don't let the dialog close mid-save
  onClose();
};

const handleUpdate=async()=>{

try{

  setSubmitting(true);

  await axios.put(

  `/schools/${school._id}`,

  form

  );

  onSuccess();

  onClose();

}catch(err){

  alert(

    err.response?.data?.message ||

    "Unable to update school."

  );

}finally{

  setSubmitting(false);

}

};

if(!school)
return null;

return(

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
    HEADER — brand gradient band with an icon badge, a
    title/subtitle pair naming the school being edited, and
    a close button. Replaces the plain DialogTitle.
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
      <EditIcon sx={{ fontSize: 20 }} />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
        Edit School
      </Typography>
      <Typography noWrap sx={{ fontSize: 13, opacity: 0.9 }}>
        Updating {school.schoolName || "this school"}
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

label="School Name"

name="schoolName"

value={
form.schoolName||""
}

onChange={
handleChange
}

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

label="Address"

name="address"

value={
form.address||""
}

onChange={
handleChange
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

</Grid>

<Grid item xs={12} sm={6}>

<TextField

fullWidth

label="Phone"

name="phone"

value={
form.phone||""
}

onChange={
handleChange
}

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

value={
form.email||""
}

onChange={
handleChange
}

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

onClick={handleUpdate}

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

{submitting ? "Updating..." : "Update School"}

</Button>

</DialogActions>

</Dialog>

);

}
