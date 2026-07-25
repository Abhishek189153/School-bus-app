import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Alert,
  Collapse,
  Fade,
  InputAdornment,
} from "@mui/material";

import VerifiedUserRoundedIcon
from "@mui/icons-material/VerifiedUserRounded";

import PasswordRoundedIcon
from "@mui/icons-material/PasswordRounded";

import DirectionsBusRoundedIcon
from "@mui/icons-material/DirectionsBusRounded";

import {
  verifyOtp,
  generateTemporaryPassword,
} from "../services/auth.service";

export default function VerifyOtp() {

  const navigate = useNavigate();

  const location = useLocation();

  const phone = location.state?.phone;

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorMessage("");

    try {

      setLoading(true);

      await verifyOtp(phone, otp);

      await generateTemporaryPassword(phone);

      navigate("/password-reset-success");

    } catch (err) {

      setErrorMessage(

        err.response?.data?.message ||

        "Invalid OTP. Please try again."

      );

    } finally {

      setLoading(false);

    }

  };

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

{/* LEFT */}

<Box
sx={{
flex:1,
color:"#fff",
background:"rgba(255,255,255,.08)",
display:"flex",
flexDirection:"column",
justifyContent:"center",
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

Verify
<br/>
Your Identity

</Typography>

<Typography
sx={{
fontSize:20,
lineHeight:1.8,
color:"rgba(255,255,255,.85)",
}}
>

Enter the verification code
sent to your registered School's email
to securely verify your identity
before resetting your password.

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

Secure Verification

</Box>

<Box
sx={{
px:3,
py:1,
borderRadius:30,
background:"rgba(255,255,255,.12)",
}}
>

OTP Protected

</Box>

</Box>

</Box>

{/* RIGHT */}

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
mb={1}

 sx={{
  fontSize: 50,
 }}
>

Verify OTP

</Typography>

<Typography
color="text.secondary"
mb={4}
>

Enter the OTP sent to your
registered School's email address.

</Typography>

<Collapse
in={Boolean(errorMessage)}
sx={{
mb:3,
}}
>

<Alert
severity="error"
sx={{
borderRadius:2,
}}
>

{errorMessage}

</Alert>

</Collapse>

<form onSubmit={handleSubmit}>

                    <Typography
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: "#334155",
                    }}
                  >
                    Verification Code
                  </Typography>

                  

                    <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    gap: 1.5,
    mb: 4,
  }}
>
  {[0, 1, 2, 3, 4, 5].map((index) => (
    <TextField
      key={index}
      value={otp[index] || ""}
      onChange={(e) => {
  const value = e.target.value.replace(/\D/g, "");

  // User pasted the complete OTP
  if (value.length === 6) {
    setOtp(value);

    document.getElementById("otp-5")?.focus();
    return;
  }

  // User pasted multiple digits from the current box
  if (value.length > 1) {
    const digits = value.slice(0, 6).split("");

    setOtp(digits.join(""));

    const lastIndex = Math.min(digits.length - 1, 5);

    document
      .getElementById(`otp-${lastIndex}`)
      ?.focus();

    return;
  }

  const newOtp = otp.padEnd(6, "").split("");

  newOtp[index] = value;

  setOtp(newOtp.join("").trimEnd());

  if (value && index < 5) {
    document
      .getElementById(`otp-${index + 1}`)
      ?.focus();
  }
}}
      onKeyDown={(e) => {

  if (e.key === "Backspace") {

    const newOtp = otp.padEnd(6, "").split("");

    if (newOtp[index]) {

      newOtp[index] = "";

      setOtp(newOtp.join("").trimEnd());

    } else if (index > 0) {

      document
        .getElementById(`otp-${index - 1}`)
        ?.focus();
    }

  }

}}
      inputProps={{
        maxLength: 1,
        style: {
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "700",
        },
      }}
      id={`otp-${index}`}
      sx={{
        width: 62,

        "& .MuiOutlinedInput-root": {
          height: 62,
          borderRadius: 3,
          background: "#F8FAFC",

          "& fieldset": {
            borderColor: "#D9E2EC",
          },

          "&:hover fieldset": {
            borderColor: "#2563EB",
          },

          "&.Mui-focused fieldset": {
            borderWidth: 2,
            borderColor: "#2563EB",
          },
        },
      }}
    />
  ))}
</Box>

<Typography
  sx={{
    mt: -2,
    mb: 4,
    color: "#64748B",
    fontSize: 14,
  }}
>
Enter the 6-digit verification code sent to your School's email.
</Typography>

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
                      <>
                        <VerifiedUserRoundedIcon
                          sx={{
                            mr: 1,
                          }}
                        />
                        Verify OTP
                      </>
                    )}
                  </Button>

                  <Box
                    sx={{
                      textAlign: "center",
                      mt: 4,
                    }}
                  >
                    <Link
                      component="button"
                      type="button"
                      onClick={() =>
                        navigate("/forgot-password")
                      }
                      sx={{
                        textDecoration: "none",
                        color: "#2563EB",
                        fontWeight: 600,
                        fontSize: 15,

                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      ← Back
                    </Link>
                  </Box>

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

                </form>

              </Box>

            </Box>

          </Paper>

        </Fade>

      </Box>

    </Box>

  );

}