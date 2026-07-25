import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Fade,
  LinearProgress,
  OutlinedInput,
  FormControl,
  InputLabel,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  LockOutlined,
} from "@mui/icons-material";

import DirectionsBusRoundedIcon
from "@mui/icons-material/DirectionsBusRounded";

import {
  changePassword,
} from "../services/auth.service";



export default function ChangePassword() {

  const navigate = useNavigate();

  
const user = JSON.parse(
  sessionStorage.getItem("user")
);

  const [form, setForm] = useState({

    newPassword: "",

    confirmPassword: "",

  });

  const [loading, setLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] =
    useState({
      newPassword: "",
      confirmPassword: "",
    });

  useEffect(() => {

    if (!user) {

      navigate("/login");

      return;

    }

    if (!user.isFirstLogin) {

      navigate("/");

    }

  }, [navigate]);

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

    if (errors[e.target.name]) {

      setErrors({

        ...errors,

        [e.target.name]: "",

      });

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    let valid = true;

    const newErrors = {

      newPassword: "",

      confirmPassword: "",

    };

    if (!form.newPassword) {

      newErrors.newPassword =
        "Please enter a password.";

      valid = false;

    }

    else if (form.newPassword.length < 6) {

      newErrors.newPassword =
        "Password must be at least 6 characters.";

      valid = false;

    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {

      newErrors.confirmPassword =
        "Passwords do not match.";

      valid = false;

    }

    if (!valid) {

      setErrors(newErrors);

      return;

    }

    try {

      setLoading(true);

      await changePassword(
        form.newPassword
      );

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      alert(
        "Password changed successfully.\n\nPlease login again."
      );

      navigate("/login");

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Unable to change password."

      );

    }

    finally {

      setLoading(false);

    }

  };

  const strength =
    form.newPassword.length === 0
      ? 0
      : form.newPassword.length < 6
      ? 35
      : form.newPassword.length < 8
      ? 65
      : 100;

  return (

<Box

sx={{

minHeight:"100vh",

background:
"linear-gradient(135deg,#0B1F3A 0%,#123B73 45%,#0E5CAD 100%)",

overflow:"hidden",

position:"relative",

}}

>

<Box

sx={{

position:"absolute",

width:350,

height:350,

borderRadius:"50%",

background:"rgba(255,255,255,.08)",

top:-120,

left:-120,

filter:"blur(20px)",

}}

/>

<Box

sx={{

position:"absolute",

width:450,

height:450,

borderRadius:"50%",

background:"rgba(37,99,235,.22)",

bottom:-150,

right:-120,

filter:"blur(40px)",

}}

/>

<Box

sx={{

height:"100vh",

display:"flex",

justifyContent:"center",

alignItems:"center",

px:3,

}}

>

<Fade in timeout={700}>

<Paper

elevation={0}

sx={{

width:"100%",

maxWidth:1300,

height:720,

display:"flex",

overflow:"hidden",

borderRadius:7,

background:"rgba(255,255,255,.12)",

backdropFilter:"blur(18px)",

border:"1px solid rgba(255,255,255,.15)",

boxShadow:
"0 30px 80px rgba(0,0,0,.25)",

}}

>

<Box

sx={{

flex:1,

background:"rgba(255,255,255,.08)",

display:"flex",

justifyContent:"center",

flexDirection:"column",

color:"#fff",

p:8,

}}

>

<Box

sx={{

width:90,

height:90,

borderRadius:4,

background:
"linear-gradient(135deg,#2563EB,#60A5FA)",

display:"flex",

justifyContent:"center",

alignItems:"center",

mb:5,

}}

>

<DirectionsBusRoundedIcon

sx={{

fontSize:50,

color:"#fff",

}}

/>

</Box>

<Typography

variant="h2"

fontWeight={700}

mb={3}

>

Create
<br/>

New Password

</Typography>

<Typography

sx={{

fontSize:20,

lineHeight:1.8,

color:"rgba(255,255,255,.85)",

}}

>

Create a strong password
to secure your School Bus
Management account before
continuing.

</Typography>

<Box

sx={{

display:"flex",

gap:2,

mt:6,

}}

>

<Box

sx={{

px:3,

py:1,

borderRadius:30,

background:"rgba(255,255,255,.12)",

}}

>

Secure Account

</Box>

<Box

sx={{

px:3,

py:1,

borderRadius:30,

background:"rgba(255,255,255,.12)",

}}

>

Strong Password

</Box>

</Box>

</Box>

<Box

sx={{

width:500,

background:"#fff",

display:"flex",

justifyContent:"center",

alignItems:"center",

p:6,

}}

>

<Box width="100%">

<Typography

variant="h3"

fontWeight={700}
fontSize={40}

mb={1}

 sx={{
  fontSize: 40,
 }}


>

Change Password

</Typography>

<Typography

color="text.secondary"

mb={4}

>

Create your own password
before using the system.

</Typography><br />

<Box
component="form"
onSubmit={handleSubmit}
noValidate
sx={{
width:"100%"
}}
>

              <Typography
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                New Password
              </Typography>

              <FormControl
  fullWidth
  sx={{ mb: 3 }}
>
  {/* <InputLabel>
    New Password
  </InputLabel> */}

  <OutlinedInput
    type={
      showNewPassword
        ? "text"
        : "password"
    }

    name="newPassword"

    value={form.newPassword}

    onChange={handleChange}

    startAdornment={
      <InputAdornment position="start">
        <LockOutlined
          sx={{
            color:"#2563EB"
          }}
        />
      </InputAdornment>
    }

    endAdornment={
      <InputAdornment position="end">
        <IconButton
          edge="end"
          onClick={() =>
            setShowNewPassword(
              !showNewPassword
            )
          }
        >
          {showNewPassword
            ? <VisibilityOff/>
            : <Visibility/>
          }
        </IconButton>
      </InputAdornment>
    }
  />
</FormControl>

              {/* <TextField
                fullWidth
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={handleChange}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined
                        sx={{
                          color: "#2563EB",
                        }}
                      />
                    </InputAdornment>
                  ),

                  endAdornment: (
  <InputAdornment position="end">
    <IconButton
      edge="end"
      onClick={() =>
        setShowNewPassword(!showNewPassword)
      }
    >
      {showNewPassword ? (
        <VisibilityOff />
      ) : (
        <Visibility />
      )}
    </IconButton>
  </InputAdornment>
),

                  sx: {
                    height: 58,
                    borderRadius: 3,
                    bgcolor: "#F8FAFC",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#E2E8F0",
                    },

                    "&:hover fieldset": {
                      borderColor: "#2563EB",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#2563EB",
                    },
                  },
                }}
              /> */}

              {/* <Box sx={{ mt: 2, mb: 3 }}>

                <LinearProgress
                  variant="determinate"
                  value={strength}
                  sx={{
                    height: 8,
                    borderRadius: 10,
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Password Strength
                </Typography>

              </Box> */}

              <Typography
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                Confirm Password
              </Typography>

              {/* <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
               InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <LockOutlined
        sx={{
          color: "#2563EB",
        }}
      />
    </InputAdornment>
  ),

  endAdornment: (
    <InputAdornment position="end">
      <IconButton
        edge="end"
        onClick={() =>
          setShowConfirmPassword(!showConfirmPassword)
        }
      >
        {showConfirmPassword ? (
          <VisibilityOff />
        ) : (
          <Visibility />
        )}
      </IconButton>
    </InputAdornment>
  ),

  sx: {
    height: 58,
    borderRadius: 3,
    bgcolor: "#F8FAFC",
  },
}}
                sx={{
                  mb: 4,

                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#E2E8F0",
                    },

                    "&:hover fieldset": {
                      borderColor: "#2563EB",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#2563EB",
                    },
                  },
                }}
              /> */}

              <FormControl
  fullWidth
  sx={{ mb: 4 }}
>
  {/* <InputLabel>
    Confirm Password
  </InputLabel> */}

  <OutlinedInput
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }

    name="confirmPassword"

    value={form.confirmPassword}

    onChange={handleChange}

    startAdornment={
      <InputAdornment position="start">
        <LockOutlined
          sx={{
            color:"#2563EB"
          }}
        />
      </InputAdornment>
    }

    endAdornment={
      <InputAdornment position="end">
        <IconButton
          edge="end"
          onClick={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
        >
          {showConfirmPassword
            ? <VisibilityOff/>
            : <Visibility/>
          }
        </IconButton>
      </InputAdornment>
    }
  />
</FormControl>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  height: 58,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: 17,
                  textTransform: "none",

                  background:
                    "linear-gradient(90deg,#2563EB,#3B82F6)",

                  boxShadow:
                    "0 18px 35px rgba(37,99,235,.35)",

                  "&:hover": {
                    background:
                      "linear-gradient(90deg,#1D4ED8,#2563EB)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Save Password"
                )}
              </Button>

              <Typography
                textAlign="center"
                sx={{
                  mt: 5,
                  color: "#94A3B8",
                  fontSize: 14,
                }}
              >
                © 2026 School Bus Management System
              </Typography>

            </Box>

          </Box>

        </Box>

      </Paper>

    </Fade>

  </Box>

</Box>

);

}