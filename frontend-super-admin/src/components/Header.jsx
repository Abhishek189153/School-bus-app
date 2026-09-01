import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Breadcrumbs,
  Link,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  let userName = "Admin";

  try {
    const user = JSON.parse(
      sessionStorage.getItem("user")
    );

    userName = user?.name || "Admin";
  } catch (error) {
    console.error("Unable to read user:", error);
  }

  // Get first letter for avatar
  const avatarLetter =
    userName?.charAt(0)?.toUpperCase() || "A";

  // =====================================================
  // CURRENT PAGE
  // =====================================================

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/schools": "Schools",
    "/school-admins": " School-Admins",
    "/settings": "Settings",
  };

  const currentPage =
    pageTitles[location.pathname] || "Dashboard";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.03)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            md: 68,
          },

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* =====================================================
            LEFT SIDE
        ===================================================== */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          {/* Dashboard Icon */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background:
                "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",

              color: "#2563eb",

              mr: 1.5,

              flexShrink: 0,
            }}
          >
            <DashboardRoundedIcon
              sx={{
                fontSize: 21,
              }}
            />
          </Box>

          {/* Breadcrumb */}
          <Breadcrumbs
            separator={
              <ChevronRightRoundedIcon
                sx={{
                  fontSize: 18,
                  color: "#94a3b8",
                }}
              />
            }
            aria-label="breadcrumb"
            sx={{
              "& .MuiBreadcrumbs-ol": {
                alignItems: "center",
              },
            }}
          >
            <Link
              underline="none"
              color="inherit"
              sx={{
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },

                fontWeight: 600,

                color: "#64748b",

                cursor: "default",

                "&:hover": {
                  color: "#64748b",
                },
              }}
            >
              SchoolBus
            </Link>

            {/* CURRENT PAGE */}
            <Typography
              sx={{
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },

                fontWeight: 700,

                color: "#0f172a",
              }}
            >
              {currentPage}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 1,
              sm: 1.5,
            },

            ml: 2,
          }}
        >
          {/* Role */}
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },

              alignItems: "center",

              px: 1.5,
              py: 0.7,

              borderRadius: "9px",

              background: "#f8fafc",

              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#475569",
                letterSpacing: "0.2px",
              }}
            >
              SUPER ADMIN
            </Typography>
          </Box>

          {/* User */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,

              pl: {
                xs: 0,
                sm: 1,
              },
            }}
          >
            {/* Avatar */}
            <Avatar
              sx={{
                width: 38,
                height: 38,

                fontSize: "15px",
                fontWeight: 700,

                background:
                  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",

                boxShadow:
                  "0 3px 8px rgba(37, 99, 235, 0.22)",
              }}
            >
              {avatarLetter}
            </Avatar>

            {/* Name */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },

                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#0f172a",

                  maxWidth: "150px",

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userName}
              </Typography>

              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  mt: 0.1,
                }}
              >
                Administrator
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}