import { Outlet, Link } from "react-router-dom";
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

import { logout } from "../redux/slices/authSlice";

const drawerWidth = 240;

const AdminLayout = () => {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
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
          },
        }}
      >
        <Toolbar />

        <List>

          <ListItemButton
            component={Link}
            to="/"
          >
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/students"
          >
            <ListItemText primary="Students" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/drivers"
          >
            <ListItemText primary="Drivers" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/parents"
          >
            <ListItemText primary="Parents" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/buses"
          >
            <ListItemText primary="Buses" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/routes"
          >
            <ListItemText primary="Routes" />
          </ListItemButton>

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