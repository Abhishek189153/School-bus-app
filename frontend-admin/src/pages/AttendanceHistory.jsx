import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";

// Direct file path imports to prevent Vite bundling/resolution errors
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DirectionsBusOutlinedIcon from "@mui/icons-material/DirectionsBusOutlined";

import StudentAttendance from "../components/StudentAttendance";
import DriverAttendance from "../components/DriverAttendance";

// Remember the last-viewed tab across visits — small thing, but a
// user checking driver attendance repeatedly shouldn't have to
// re-click past "Student Attendance" (the default) every time.
const TAB_STORAGE_KEY = "attendanceHistoryLastTab";

export default function AttendanceHistory() {
  const [tab, setTab] = useState(() => {
    return localStorage.getItem(TAB_STORAGE_KEY) || "student";
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    localStorage.setItem(TAB_STORAGE_KEY, newValue);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Page Header Container */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          {/* Title & Badge */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Attendance History
            </Typography>
            <Chip
              label="Daily Tracking"
              size="small"
              sx={{
                fontWeight: 600,
                backgroundColor: "#eff6ff",
                color: "#1d4ed8",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>

        {/* Styled Tab Bar */}
        <Box sx={{ borderBottom: 1, borderColor: "#e2e8f0" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                minHeight: 48,
                px: 3,
                color: "#64748b",
                "&.Mui-selected": {
                  color: "#2563eb",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#2563eb",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab
              icon={<SchoolOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Student Attendance"
              value="student"
            />
            <Tab
              icon={<DirectionsBusOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Driver Attendance"
              value="driver"
            />
          </Tabs>
        </Box>
      </Paper>

      {/* Tab Panel Render Area — BOTH panels stay mounted at all times,
          toggled with display:none/block instead of a ternary that
          swaps which component renders. The previous ternary approach
          fully unmounted the inactive tab, which meant every tab
          switch: (1) lost any date/bus/route filter or search text
          the user had set, (2) reset pagination back to page 1, and
          (3) re-triggered a full data fetch from scratch — even if
          they'd just been on that tab 5 seconds earlier. Keeping both
          mounted preserves state and avoids the redundant refetch,
          making tab switches instant after the first load of each. */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: tab === "student" ? "block" : "none" }}>
          <StudentAttendance />
        </Box>
        <Box sx={{ display: tab === "driver" ? "block" : "none" }}>
          <DriverAttendance />
        </Box>
      </Box>
    </Box>
  );
}
