import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Fade,
  Grow,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { loginUser } from "../services/auth.service";
import { loginSuccess } from "../redux/slices/authSlice";

// Small helper so every staggered element shares the same
// fade + slide-up entrance, just with a different delay.
const Reveal = ({ show, delay = 0, children, ...props }) => (
  <Grow
    in={show}
    timeout={600}
    style={{ transformOrigin: "0 0 0", transitionDelay: show ? `${delay}ms` : "0ms" }}
    {...props}
  >
    <Box
      sx={{
        // Grow already handles opacity/scale; add a slide-up too
        transform: show ? "translateY(0)" : "translateY(16px)",
        opacity: show ? 1 : 0,
        transition: `transform 600ms cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity 600ms ease ${delay}ms`,
      }}
    >
      {children}
    </Box>
  </Grow>
);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cardIn, setCardIn] = useState(false);
  const [contentIn, setContentIn] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  // Sequence: card fades/scales in first, then inner content
  // staggers in shortly after — matches the reference animation.
  useEffect(() => {
    const t1 = setTimeout(() => setCardIn(true), 100);
    const t2 = setTimeout(() => setContentIn(true), 450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      dispatch(
        loginSuccess({
          token: data.token,
          user: data.user,
        })
      );

      if (data.user.isFirstLogin) {
        navigate("/change-password");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
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
        "@keyframes floatA": {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(20px,30px)" },
        },
        "@keyframes floatB": {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(-25px,-20px)" },
        },
      }}
    >
      {/* Floating Circles */}

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
          animation: "floatA 9s ease-in-out infinite",
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
          animation: "floatB 11s ease-in-out infinite",
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={cardIn} timeout={700}>
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
              boxShadow: "0 30px 80px rgba(0,0,0,.25)",
              transform: cardIn ? "scale(1)" : "scale(.97)",
              transition: "transform 700ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            {/* LEFT SIDE */}

            <Box
              sx={{
                flex: 1,
                color: "#fff",
                p: 8,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Reveal show={contentIn} delay={0}>
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: 4,
                    background: "linear-gradient(135deg,#2563EB,#60A5FA)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 5,
                    boxShadow: "0 15px 40px rgba(37,99,235,.4)",
                  }}
                >
                  <DirectionsBusRoundedIcon sx={{ fontSize: 48, color: "#fff" }} />
                </Box>
              </Reveal>

              <Reveal show={contentIn} delay={120}>
                <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1.2, mb: 3 }}>
                  School Bus
                  <br />
                  Management
                </Typography>
              </Reveal>

              <Reveal show={contentIn} delay={240}>
                <Typography
                  sx={{
                    fontSize: 20,
                    color: "rgba(255,255,255,.85)",
                    maxWidth: 470,
                    lineHeight: 1.8,
                  }}
                >
                  Securely manage buses, routes, students, parents and
                  drivers from one modern dashboard.
                </Typography>
              </Reveal>

              <Reveal show={contentIn} delay={360}>
                <Box sx={{ display: "flex", gap: 2, mt: 6 }}>
                  <Box
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 30,
                      background: "rgba(255,255,255,.12)",
                    }}
                  >
                    Live Tracking
                  </Box>

                  <Box
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 30,
                      background: "rgba(255,255,255,.12)",
                    }}
                  >
                    Smart Notifications
                  </Box>
                </Box>
              </Reveal>
            </Box>

            {/* RIGHT SIDE */}

            <Box
              sx={{
                width: 500,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 6,
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Reveal show={contentIn} delay={140}>
                  <Typography variant="h3" fontWeight={700} mb={1}>
                    Welcome Back
                  </Typography>
                </Reveal>

                <Reveal show={contentIn} delay={220}>
                  <Typography color="text.secondary" mb={5}>
                    Login to continue
                  </Typography><br />
                </Reveal>

                <form onSubmit={handleSubmit}>
                  <Reveal show={contentIn} delay={300}>
                    <Typography sx={{ mb: 1, fontWeight: 600, color: "#334155" }}>
                      Phone Number
                    </Typography>

                    <TextField
                      fullWidth
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneRoundedIcon sx={{ color: "#2563EB" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          height: 58,
                          borderRadius: 3,
                          bgcolor: "#F8FAFC",
                          transition: "box-shadow 250ms ease",
                          "&.Mui-focused": {
                            boxShadow: "0 0 0 4px rgba(37,99,235,.15)",
                          },
                        },
                      }}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#E2E8F0",
                            transition: "border-color 250ms ease",
                          },
                          "&:hover fieldset": { borderColor: "#2563EB" },
                          "&.Mui-focused fieldset": { borderColor: "#2563EB" },
                        },
                      }}
                    />
                  </Reveal>

                  <Reveal show={contentIn} delay={380}>
                    <Typography sx={{ mb: 1, fontWeight: 600, color: "#334155" }}>
                      Password
                    </Typography>

                    {/* <TextField
                      fullWidth
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon sx={{ color: "#2563EB" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <VisibilityOffRoundedIcon />
                              ) : (
                                <VisibilityRoundedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          height: 58,
                          borderRadius: 3,
                          bgcolor: "#F8FAFC",
                          transition: "box-shadow 250ms ease",
                          "&.Mui-focused": {
                            boxShadow: "0 0 0 4px rgba(37,99,235,.15)",
                          },
                        },
                      }}
                      sx={{
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#E2E8F0",
                            transition: "border-color 250ms ease",
                          },
                          "&:hover fieldset": { borderColor: "#2563EB" },
                          "&.Mui-focused fieldset": { borderColor: "#2563EB" },
                        },
                      }}
                    /> */}

                    <FormControl
  fullWidth
  sx={{
    mb: 1,
  }}
>
  {/* <InputLabel>
    Password
  </InputLabel> */}

  <OutlinedInput
    name="password"
    type={
      showPassword
        ? "text"
        : "password"
    }

    value={formData.password}

    onChange={handleChange}

    startAdornment={
      <InputAdornment position="start">
        <LockRoundedIcon
  sx={{
    color:
      formData.password
        ? "#2563EB"
        : "#94A3B8",
  }}
/>
      </InputAdornment>
    }

    endAdornment={
      <InputAdornment position="end">
        <IconButton
          edge="end"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
        >
          {showPassword ? (
            <VisibilityRoundedIcon
  sx={{
    color:
      formData.password
        ? "#2563EB"
        : "#6B7280",
  }}
/>
          ) : (
            <VisibilityOffRoundedIcon
  sx={{
    color:
      formData.password
        ? "#2563EB"
        : "#6B7280",
  }}
/>
          )}
        </IconButton>
      </InputAdornment>
    }

  sx={{
  height: 58,
  borderRadius: 3,

  bgcolor:
    formData.password
      ? "#EAF2FF"
      : "#F8FAFC",

  transition: "all .25s ease",

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2563EB",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2563EB",
  },

  "&.Mui-focused": {
    boxShadow: "0 0 0 4px rgba(37,99,235,.15)",
  },
}}
  />
</FormControl>
                  </Reveal>

                  <Reveal show={contentIn} delay={440}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 4 }}>
                      <Typography
                        sx={{
                          color: "#2563EB",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 14,
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot Password?
                      </Typography>
                    </Box>
                  </Reveal>

                  <Reveal show={contentIn} delay={500}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        height: 58,
                        borderRadius: 3,
                        fontSize: 17,
                        fontWeight: 700,
                        textTransform: "none",
                        background: "linear-gradient(90deg,#2563EB,#3B82F6)",
                        boxShadow: "0 18px 35px rgba(37,99,235,.35)",
                        transition: "transform 200ms ease, box-shadow 200ms ease",
                        "&:hover": {
                          background: "linear-gradient(90deg,#1D4ED8,#2563EB)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 22px 40px rgba(37,99,235,.45)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                      }}
                    >
                      {loading ? <CircularProgress color="inherit" size={26} /> : "Login"}
                    </Button>
                  </Reveal>

                  <Reveal show={contentIn} delay={560}>
                    <Typography
                      textAlign="center"
                      sx={{ mt: 5, color: "#94A3B8", fontSize: 14 }}
                    >
                      © 2026 School Bus Management System 2026. All rights reserved.
                    </Typography>
                  </Reveal>
                </form>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
