import {
  Box,
  Button,
  Fade,
  Paper,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";

import { useNavigate } from "react-router-dom";

export default function PasswordResetSuccess() {

  const navigate = useNavigate();

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

      {/* Background Glow */}

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
                background: "rgba(255,255,255,.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 8,
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
                Password
                <br />
                Generated
              </Typography>

              <Typography
                sx={{
                  fontSize: 20,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,.85)",
                }}
              >
                Your temporary password has
                been generated successfully.
                Use the credentials sent to
                your registered email to
                login securely.
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
                  Secure Login
                </Box>

                <Box
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 30,
                    background: "rgba(255,255,255,.12)",
                  }}
                >
                  Protected Access
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

              <Box
                sx={{
                  width: "100%",
                  textAlign: "center",
                }}
              >

                <CheckCircleRoundedIcon
                  sx={{
                    fontSize: 90,
                    color: "#22C55E",
                    mb: 3,
                  }}
                />

                <Typography
                  variant="h3"
                  fontWeight={700}
                  mb={2}
                >
                  Success!
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.8,
                    mb: 4,
                  }}
                >
                  A temporary password has been
                  successfully sent to your
                  school's registered email.

                  <br />

                  Please use the temporary
                  password to login and change
                  it after signing in.
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
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
                  Back to Login
                </Button>

                <Typography
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

          </Paper>

        </Fade>

      </Box>

    </Box>

  );

}