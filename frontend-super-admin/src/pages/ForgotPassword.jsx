import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";

import {
  forgotPassword,
} from "../services/auth.service";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorMessage("");

    try {

      setLoading(true);

      await forgotPassword(phone);

      navigate(
        "/verify-otp",
        {
          state: {
            phone,
          },
        }
      );

    } catch (err) {

      setErrorMessage(
        err.response?.data?.message ||
        "Unable to send OTP. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0B1F3A 0%,#123B73 45%,#0E5CAD 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >

      {/* Background Blur */}

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(255,255,255,.08)",
          top: -120,
          left: -120,
          filter: "blur(20px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "rgba(37,99,235,.22)",
          bottom: -150,
          right: -120,
          filter: "blur(40px)",
        }}
      />

      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
        }}
      >

        <Fade in timeout={700}>

          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 1300,
              height: 720,
              display: "flex",
              overflow: "hidden",
              borderRadius: 7,
              background: "rgba(255,255,255,.12)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,.15)",
              boxShadow:
                "0 30px 80px rgba(0,0,0,.25)",
            }}
          >

            {/* LEFT PANEL */}

            <Box
              sx={{
                flex: 1,
                color: "#fff",
                p: 8,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "rgba(255,255,255,.08)",
              }}
            >

              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg,#2563EB,#60A5FA)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 5,
                }}
              >

                <DirectionsBusRoundedIcon
                  sx={{
                    fontSize: 50,
                    color: "#fff",
                  }}
                />

              </Box>

              <Typography
                variant="h2"
                fontWeight={700}
                mb={3}
              >
                Recover
                <br />
                Your Account
              </Typography>

              <Typography
                sx={{
                  fontSize: 20,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,.85)",
                }}
              >
                Forgot your password?
                Don't worry.
                Verify your registered mobile
                number and we'll securely send
                an OTP to continue.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 6,
                }}
              >

                <Box
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 30,
                    background: "rgba(255,255,255,.12)",
                  }}
                >
                  Secure OTP
                </Box>

                <Box
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 30,
                    background: "rgba(255,255,255,.12)",
                  }}
                >
                  Fast Recovery
                </Box>

              </Box>

            </Box>

            {/* RIGHT PANEL */}

            <Box
              sx={{
                width: 500,
                background: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 6,
              }}
            >

              <Box width="100%">

                <Typography
                  variant="h3"
                  fontWeight={700}
                  mb={1}

                   sx={{
                  fontSize: 40,
              }}
                >
                  Forgot Password
                </Typography>

                <Typography
                  color="text.secondary"
                  mb={4}
                >
                  Enter your registered mobile number
                  to receive an OTP.
                </Typography>

                <Collapse
                  in={Boolean(errorMessage)}
                  sx={{ mb: 3 }}
                >
                  <Alert
                    severity="error"
                    sx={{
                      borderRadius: 2,
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
                    Phone Number
                  </Typography>

                  <TextField
                    fullWidth
                    autoFocus
                    required
                    disabled={loading}
                    type="tel"
                    placeholder="Enter your registered phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneRoundedIcon
                            sx={{ color: "#2563EB" }}
                          />
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
                  />

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
                      "Send OTP"
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
                      onClick={() => navigate("/login")}
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
                      ← Back to Login
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