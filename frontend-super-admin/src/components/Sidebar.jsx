import {

  Box,

  List,

  ListItemButton,

  ListItemIcon,

  ListItemText,

  Typography,

} from "@mui/material";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

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

const handleLogout = () => {
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
    onClick={handleLogout}
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

    </Box>

  );

}