import {

  Box,

  List,

  ListItemButton,

  ListItemIcon,

  ListItemText,

  Typography,

  Dialog,

  DialogContent,

  DialogActions,

  Button,

} from "@mui/material";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import DashboardIcon
from "@mui/icons-material/Dashboard";

import SchoolIcon
from "@mui/icons-material/School";

import AdminPanelSettingsIcon
from "@mui/icons-material/AdminPanelSettings";

import SettingsIcon
from "@mui/icons-material/Settings";

import LogoutIcon
from "@mui/icons-material/Logout";



export default function Sidebar() {

  const location =
    useLocation();

    const navigate = useNavigate();

const [logoutOpen, setLogoutOpen] = useState(false);

const handleLogoutClick = () => {
  setLogoutOpen(true);
};

const handleLogoutCancel = () => {
  setLogoutOpen(false);
};

const handleLogoutConfirm = () => {
  sessionStorage.clear();

  window.location.replace("/login");
};

  const menu = [

    {

      title:
        "Dashboard",

      icon:
        <DashboardIcon />,

      path:
        "/",

    },

    {

      title:
        "Schools",

      icon:
        <SchoolIcon />,

      path:
        "/schools",

    },

    {

      title:
        "School Admins",

      icon:
        <AdminPanelSettingsIcon />,

      path:
        "/school-admins",

    },

    {

      title:
        "Settings",

      icon:
        <SettingsIcon />,

      path:
        "/settings",

    },

  ];

  return (

    <Box

      sx={{

        width: 260,

        background: "#111827",

        color: "#fff",

        minHeight: "100vh",

      }}

    >

      <Typography

        variant="h5"

        fontWeight="bold"

        sx={{

          p: 3,

        }}

      >

        🚌 SchoolBus

      </Typography>

      <List>

        {

          menu.map(

            (item) => (

              <ListItemButton

                key={
                  item.title
                }

                component={
                  Link
                }

                to={
                  item.path
                }

                selected={
                  location.pathname ===
                  item.path
                }

                sx={{

                  color:
                    "#fff",

                  mx: 1,

                  borderRadius:
                    2,

                  "&.Mui-selected": {

                    background:
                      "#2563EB",

                  },

                }}

              >

                <ListItemIcon

                  sx={{

                    color:
                      "#fff",

                  }}

                >

                  {

                    item.icon

                  }

                </ListItemIcon>

                <ListItemText

                  primary={
                    item.title
                  }

                />

              </ListItemButton>

            )

          )

        }

      </List>

     <Box
  sx={{
    position: "absolute",
    bottom: 20,
    width: 260,
  }}
>
  <ListItemButton
    onClick={handleLogoutClick}
    sx={{
      color: "#fff",
      mx: 1,
      borderRadius: 2,
      "&:hover": {
        backgroundColor: "#DC2626",
      },
    }}
  >
    <ListItemIcon
      sx={{
        color: "#fff",
      }}
    >
      <LogoutIcon />
    </ListItemIcon>

    <ListItemText primary="Logout" />
  </ListItemButton>
</Box>

{/* =====================================================
    LOGOUT CONFIRMATION — same centered-badge card style
    used by ConfirmDelete, but a neutral amber accent
    instead of red since logging out isn't destructive.
===================================================== */}

<Dialog
  open={logoutOpen}
  onClose={handleLogoutCancel}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: { borderRadius: "18px", overflow: "hidden" },
  }}
>

  <Box sx={{ px: 3, pt: 3.5, pb: 1, textAlign: "center" }}>
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "#fef3c7",
        color: "#b45309",
        mx: "auto",
        mb: 1.5,
      }}
    >
      <LogoutIcon sx={{ fontSize: 24 }} />
    </Box>

    <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
      Log out of SchoolBus?
    </Typography>
  </Box>

  <DialogContent sx={{ px: 3, pb: 1 }}>

    <Typography sx={{ textAlign: "center", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
      You'll need to sign in again to access the admin dashboard.
    </Typography>

  </DialogContent>

  <DialogActions
    sx={{
      px: 3,
      py: 2.5,
      gap: 1.5,
    }}
  >

    <Button
      fullWidth
      onClick={handleLogoutCancel}
      sx={{
        color: "#64748b",
        fontWeight: 700,
        textTransform: "none",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        py: 1,
      }}
    >
      Cancel
    </Button>

    <Button
      fullWidth
      variant="contained"
      onClick={handleLogoutConfirm}
      sx={{
        background: "#DC2626",
        fontWeight: 700,
        textTransform: "none",
        borderRadius: "10px",
        py: 1,
        boxShadow: "0 4px 12px rgba(220,38,38,0.25)",

        "&:hover": {
          background: "#B91C1C",
          boxShadow: "0 6px 16px rgba(220,38,38,0.32)",
        },
      }}
    >
      Logout
    </Button>

  </DialogActions>

</Dialog>

    </Box>

  );

}
