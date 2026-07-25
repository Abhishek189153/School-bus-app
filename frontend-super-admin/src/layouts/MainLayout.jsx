import {
  Box,
} from "@mui/material";

import {
  Outlet,
} from "react-router-dom";

import Sidebar
from "../components/Sidebar";

import Header
from "../components/Header";

export default function MainLayout() {

  return (

    <Box
      sx={{
        display: "flex",
        background: "#F4F7FC",
        minHeight: "100vh",
      }}
    >

      <Sidebar />

      <Box
        sx={{
          flex: 1,
        }}
      >

        <Header />

        <Box
          sx={{
            p: 4,
          }}
        >

          <Outlet />

        </Box>

      </Box>

    </Box>

  );

}