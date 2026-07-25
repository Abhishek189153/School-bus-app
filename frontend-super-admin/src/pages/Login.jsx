import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";

import axios from "../api/axios";

import VisibilityRoundedIcon
from "@mui/icons-material/VisibilityRounded";

import VisibilityOffRoundedIcon
from "@mui/icons-material/VisibilityOffRounded";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {

    const token = sessionStorage.getItem("token");

    const user = JSON.parse(
        sessionStorage.getItem("user")
    );

    if (token && user) {

        if (user.isFirstLogin) {

            navigate("/change-password");

        } else {

            navigate("/");

        }

    }

}, [navigate]);

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [isLampOn, setIsLampOn] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    try {
      const res = await axios.post("/auth/login", form);

      if (res.data.user.role !== "SUPER_ADMIN") {
        alert("Access Denied. Only Super Admin can login.");
        return;
      }

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.isFirstLogin) {

    navigate("/change-password");

} else {

    navigate("/");

}
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  // FIX HERE: Removed the password focus check so the light beam stays on
  const showLightBeam = isLampOn;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg,#0f172a 0%,#172033 45%,#1e293b 100%)",
      }}
    >
      {/* Ambient Glow */}
      <Box
        sx={{
          position: "absolute",
          left: "28%",
          top: "45%",
          transform: "translate(-50%,-50%)",
          width: 1100,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(253,224,71,.18) 0%, rgba(253,224,71,0) 70%)",
          opacity: showLightBeam ? 1 : 0,
          transition: ".5s",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: {
            xs: 4,
            md: 10,
            lg: 14,
          },
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* ================= LEFT SIDE ================= */}
        <Box
          sx={{
            width: "45%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              color: "#fff !important",
              letterSpacing: "-1px",
              mb: 1,
            }}
          >
            School Bus Management
          </Typography>

          <Typography
            sx={{
              color: "#d1d5db !important",
              mb: 6,
              fontSize: 18,
            }}
          >
            Secure Super Admin Portal
          </Typography>

          {!isLampOn && (
            <Typography
              sx={{
                position: "absolute",
                top: 70,
                bgcolor: "#3b82f6",
                color: "#fff",
                px: 2.5,
                py: 1,
                borderRadius: 2,
                fontWeight: 700,
                animation: "bounce 2s infinite",
                "@keyframes bounce": {
                  "0%,100%": {
                    transform: "translateY(0)",
                  },
                  "50%": {
                    transform: "translateY(-8px)",
                  },
                },
              }}
            >
              💡 Pull the chain to switch ON
            </Typography>
          )}

          <Box
            sx={{
              width: 380,
              height: 480,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 160 220"
            >
              <polygon
                points="40,90 120,90 160,220 0,220"
                fill="url(#lightCone)"
                style={{
                  opacity: showLightBeam ? 1 : 0,
                  transition: ".5s",
                }}
              />

              <path
                d="M50 20L110 20L125 90L35 90Z"
                fill={showLightBeam ? "#fde68a" : "#334155"}
              />

              {showLightBeam ? (
                <>
                  <circle cx="65" cy="50" r="5" fill="#1e293b" />
                  <circle cx="95" cy="50" r="5" fill="#1e293b" />
                  <path d="M72 64Q80 76 88 64" fill="#ef4444" />
                </>
              ) : (
                <>
                  <path
                    d="M60 52Q65 57 70 52"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M90 52Q95 57 100 52"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="66"
                    r="3"
                    stroke="#94a3b8"
                    fill="none"
                  />
                </>
              )}

              <g
                style={{ cursor: "pointer" }}
                onClick={() => setIsLampOn(!isLampOn)}
              >
                <rect
                  x="98"
                  y="90"
                  width="18"
                  height="70"
                  fill="transparent"
                />
                <line
                  x1="105"
                  y1="90"
                  x2="105"
                  y2={isLampOn ? 136 : 144}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                <circle
                  cx="105"
                  cy={isLampOn ? 139 : 147}
                  r="5"
                  fill={isLampOn ? "#10b981" : "#94a3b8"}
                />
              </g>

              <rect
                x="77"
                y="90"
                width="6"
                height="110"
                fill="#475569"
              />
              <path
                d="M55 200L105 200A10 10 0 01105 210L55 210A10 10 0 0155 200"
                fill="#64748b"
              />

              <defs>
                <linearGradient
                  id="lightCone"
                  x1="80"
                  y1="90"
                  x2="80"
                  y2="220"
                >
                  <stop
                    offset="0%"
                    stopColor="#fde047"
                    stopOpacity=".45"
                  />
                  <stop
                    offset="100%"
                    stopColor="#fde047"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        </Box>

        {/* ================= RIGHT SIDE ================= */}
        <Box
          sx={{
            width: "55%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: isLampOn ? 1 : 0,
            transform: isLampOn ? "translateX(0)" : "translateX(80px)",
            pointerEvents: isLampOn ? "auto" : "none",
            transition: "all .6s ease",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 520,
              p: 6,
              borderRadius: 5,
              background: "rgba(30,41,59,.88)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow: "0 35px 80px rgba(0,0,0,.45)",
            }}
          >
            <Typography
              variant="h2"
              fontWeight={500}
              mb={1}
              sx={{
                color: "#ffffff !important",
                fontSize: 40,
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              sx={{
                color: "#d1d5db",
                mb: 5,
                fontSize: 16,
              }}
            >
              Login to your School Bus Management Dashboard
            </Typography>

            <Typography
  sx={{
    color: "#cbd5e1",
    mb: 1,
    fontWeight: 600,
  }}
>
  Phone Number
</Typography>

<TextField
  fullWidth
  name="phone"
  placeholder="Enter phone number"
  value={form.phone}
  onChange={handleChange}
  margin="normal"
  sx={{
    background: "#0f172a",
    borderRadius: 3,
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#334155" },
      "&:hover fieldset": { borderColor: "#3b82f6" },
      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
    },
    // Forces text inside input and any browser autofill to be bright white
    "& input": {
      color: "#ffffff !important",
      WebkitTextFillColor: "#ffffff !important",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px #0f172a inset !important",
      WebkitTextFillColor: "#ffffff !important",
    },
  }}
/>

<Typography
  sx={{
    color: "#cbd5e1",
    mb: 1,
    fontWeight: 600,
  }}
>
  Password
</Typography>

{/* <TextField
  fullWidth
  type="password"
  name="password"
  placeholder="Enter password"
  value={form.password}
  onChange={handleChange}
  margin="normal"
  sx={{
    background: "#0f172a",
    borderRadius: 3,
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#334155" },
      "&:hover fieldset": { borderColor: "#3b82f6" },
      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
    },
    // Forces text inside input and any browser autofill to be bright white
    "& input": {
      color: "#ffffff !important",
      WebkitTextFillColor: "#ffffff !important",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px #0f172a inset !important",
      WebkitTextFillColor: "#ffffff !important",
    },
  }}
/> */}

  <FormControl
  fullWidth
  margin="normal"
    sx={{
    backgroundColor: "#0F172A",
    borderRadius: 3,
  }}
>
  {/* <InputLabel
    sx={{
      color: "#94A3B8",

      "&.Mui-focused": {
        color: "#3B82F6",
      },
    }}
  >
    Password
  </InputLabel> */}

  <OutlinedInput
    name="password"
    type={
      showPassword
        ? "text"
        : "password"
    }

    value={form.password}

    onChange={handleChange}
    autoComplete="current-password"

inputProps={{
  autoComplete: "current-password",
}}

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
                color: "#94A3B8",
              }}
            />
          ) : (
            <VisibilityOffRoundedIcon
              sx={{
                color: "#94A3B8",
              }}
            />
          )}
        </IconButton>
      </InputAdornment>
    }

    sx={{
      borderRadius: 3,
      background: "#0F172A",

      color: "#fff",

     "& input": {
        color: "#FFFFFF",
        WebkitTextFillColor: "#FFFFFF",
        caretColor: "#FFFFFF",
      },

      "& input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px #0F172A inset",
          WebkitTextFillColor: "#FFFFFF",
          caretColor: "#FFFFFF",
          borderRadius: "12px",
          transition: "background-color 9999s ease-in-out 0s",
        },

        "& input:-webkit-autofill:hover": {
          WebkitBoxShadow: "0 0 0 1000px #0F172A inset",
          WebkitTextFillColor: "#FFFFFF",
        },

        "& input:-webkit-autofill:focus": {
          WebkitBoxShadow: "0 0 0 1000px #0F172A inset",
          WebkitTextFillColor: "#FFFFFF",
        },

      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#334155",
      },

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3B82F6",
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3B82F6",
      },
    }}
  />
</FormControl>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 5,
                height: 58,
                borderRadius: 3,
                fontSize: 17,
                fontWeight: 700,
                textTransform: "none",
                background:
                  "linear-gradient(90deg,#2563eb,#3b82f6)",
                boxShadow:
                  "0 15px 35px rgba(37,99,235,.35)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg,#1d4ed8,#2563eb)",
                },
              }}
              onClick={login}
            >
              Login
            </Button>

            <Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    mt: 2,
  }}
>

  <Typography
    component={Link}
    to="/forgot-password"
    sx={{
      color: "#60A5FA",
      textDecoration: "none",
      fontWeight: 600,
      fontSize: 14,

      "&:hover": {
        textDecoration: "underline",
      },
    }}
  >

    Forgot Password?

  </Typography>

</Box>

            <Typography
              textAlign="center"
              sx={{
                mt: 4,
                color: "#94a3b8 !important",
                fontSize: 14,
              }}
            >
              School Bus Management System
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}