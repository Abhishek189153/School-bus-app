import { Outlet, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  useState,
} from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RouteIcon from "@mui/icons-material/Route";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";

import { logout } from "../redux/slices/authSlice";

const drawerWidth = 240;

const AdminLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(
    (state) => state.auth.user
  );

  const [logoutOpen, setLogoutOpen] = useState(false);

  const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/",
  },
  {
    text: "Students",
    icon: <SchoolIcon />,
    path: "/students",
  },
  {
    text: "Drivers",
    icon: <PersonIcon />,
    path: "/drivers",
  },
  {
    text: "Parents",
    icon: <GroupsIcon />,
    path: "/parents",
  },
  {
    text: "Buses",
    icon: <DirectionsBusIcon />,
    path: "/buses",
  },
  {
    text: "Routes",
    icon: <RouteIcon />,
    path: "/routes",
  },
  {
    text: "Assignments",
    icon: <AssignmentIcon />,
    path: "/assignments",
  },
  {
    text: "Bus Overview",
    icon: <MapIcon />,
    path: "/bus-overview",
  },
  {
   text: "Attendance History",
    icon: <MapIcon />,
    path: "/attendance-history",
  },
  {
  text: "Holiday Management",
  icon: <EventIcon />,
  path: "/holidays",
},
];

  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutOpen(false);
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          background:
            "linear-gradient(135deg,#1976d2,#42a5f5)",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            School Bus Management
          </Typography>

          <Typography sx={{ mr: 2 }}>
            {user?.name}
          </Typography>

          <Button
            onClick={handleLogoutClick}
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            sx={{
              background: "#DC2626",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 2.2,
              py: 0.7,
              boxShadow: "0 3px 10px rgba(220,38,38,0.35)",

              "&:hover": {
                background: "#B91C1C",
                boxShadow: "0 5px 14px rgba(220,38,38,0.45)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "#f8fafc",
            borderRight:
            "1px solid #e2e8f0",
          },
        }}
      >
        <Toolbar />

              <List sx={{ mt: 2 }}>

          {menuItems.map((item) => (

            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              selected={
                location.pathname === item.path
              }
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 3,

                "&.Mui-selected": {
                  background:
                    "linear-gradient(135deg,#667eea,#764ba2)",
                  color: "#fff",
                },

                "&.Mui-selected:hover": {
                  background:
                    "linear-gradient(135deg,#667eea,#764ba2)",
                },

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#667eea,#764ba2)",
                  color: "#fff",
                  transform:
                    "translateX(5px)",
                },

                transition: "all 0.3s ease",
              }}
            >

              <Box
                sx={{
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {item.icon}
              </Box>

              <ListItemText
                primary={item.text}
              />

            </ListItemButton>

          ))}

        </List>

      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      {/* =====================================================
          LOGOUT CONFIRMATION — centered-badge card, kept in
          the same gradient/rounded visual language as the
          rest of this layout (app bar + selected-item colors).
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
            Log out{user?.name ? `, ${user.name}` : ""}?
          </Typography>
        </Box>

        <DialogContent sx={{ px: 3, pb: 1 }}>

          <Typography sx={{ textAlign: "center", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
            You'll need to sign in again to access School Bus Management.
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
              background: "linear-gradient(135deg,#1976d2,#42a5f5)",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              py: 1,
              boxShadow: "0 4px 12px rgba(25,118,210,0.25)",

              "&:hover": {
                background: "linear-gradient(135deg,#1565c0,#2196f3)",
                boxShadow: "0 6px 16px rgba(25,118,210,0.32)",
              },
            }}
          >
            Logout
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
};

export default AdminLayout;
