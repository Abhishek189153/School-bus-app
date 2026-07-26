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
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RouteIcon from "@mui/icons-material/Route";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import EventIcon from "@mui/icons-material/Event";

import { logout } from "../redux/slices/authSlice";

const drawerWidth = 240;

const AdminLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(
    (state) => state.auth.user
  );

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

  const handleLogout = () => {
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
            color="inherit"
            onClick={handleLogout}
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
    </Box>
  );
};

export default AdminLayout;