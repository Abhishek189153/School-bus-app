import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import { useEffect, useState } from "react";

import { getWorkingDays } from "../services/workingDay.service";

import UpdateWorkingDaysDialog from "./UpdateWorkingDaysDialog";

export default function WorkingDaysCard() {

  const [workingDays, setWorkingDays] = useState(null);

  const [open, setOpen] = useState(false);

  const fetchWorkingDays = async () => {

    try {

      const data = await getWorkingDays();

      setWorkingDays(data.workingDays);

    }

    catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchWorkingDays();

  }, []);

  if (!workingDays) return null;

  const days = [

    {
      label: "Mon",
      key: "monday",
    },

    {
      label: "Tue",
      key: "tuesday",
    },

    {
      label: "Wed",
      key: "wednesday",
    },

    {
      label: "Thu",
      key: "thursday",
    },

    {
      label: "Fri",
      key: "friday",
    },

    {
      label: "Sat",
      key: "saturday",
    },

    {
      label: "Sun",
      key: "sunday",
    },

  ];

  const activeCount = days.filter(
    (d) => workingDays[d.key]
  ).length;

  return (
  <>
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", lg: 420 },
        borderRadius: "18px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 8px 22px rgba(15,23,42,.05)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EEF2F7",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color: "#0F172A",
            fontSize: "1rem",
          }}
        >
          Working Schedule
        </Typography>

        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setOpen(true)}
          sx={{
            minWidth: 0,
            px: 1.6,
            py: 0.6,
            fontSize: "0.75rem",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            background:
              "linear-gradient(135deg,#6366F1,#4F46E5)",
            boxShadow:
              "0 6px 14px rgba(99,102,241,.25)",
          }}
        >
          Update
        </Button>
      </Box>

      {/* Days */}
      <Box sx={{ p: 1.6 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 1,
          }}
        >
          {days.map((day) => {
            const active = workingDays[day.key];

            return (
              <Box
                key={day.key}
                sx={{
                  borderRadius: "12px",
                  border: active
                    ? "1px solid #BBF7D0"
                    : "1px solid #E2E8F0",
                  background: active
                    ? "#F0FDF4"
                    : "#F8FAFC",
                  py: 0.9,
                  textAlign: "center",
                  transition: ".25s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 8px 16px rgba(15,23,42,.06)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  {day.label}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    my: 0.5,
                  }}
                >
                  {active ? (
                    <CheckRoundedIcon
                      sx={{
                        color: "#16A34A",
                        fontSize: 18,
                      }}
                    />
                  ) : (
                    <CloseRoundedIcon
                      sx={{
                        color: "#94A3B8",
                        fontSize: 18,
                      }}
                    />
                  )}
                </Box>

                <Typography
                  sx={{
                    fontSize: "0.58rem",
                    color: active
                      ? "#16A34A"
                      : "#94A3B8",
                    fontWeight: 600,
                  }}
                >
                  {active ? "Open" : "Off"}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>

    <UpdateWorkingDaysDialog
      open={open}
      handleClose={() => setOpen(false)}
      refresh={fetchWorkingDays}
      workingDays={workingDays}
    />
  </>
);

}