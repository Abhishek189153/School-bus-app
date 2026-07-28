import {
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import {
  useEffect,
  useState,
} from "react";

import {
  getWorkingDays,
} from "../services/workingDay.service";

import UpdateWorkingDaysDialog
from "./UpdateWorkingDaysDialog";

export default function WorkingDaysCard() {

  const [workingDays, setWorkingDays] = useState(null);

  const [open, setOpen] = useState(false);

  const fetchWorkingDays = async () => {

    try {

      const data =
        await getWorkingDays();

      setWorkingDays(
        data.workingDays
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchWorkingDays();

  }, []);

  if (!workingDays)
    return null;

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

  return (

    <>

      <Paper
        elevation={0}
        sx={{

          p: 2.5,

          borderRadius: "18px",

          border:
            "1px solid #E2E8F0",

          boxShadow:
            "0 10px 25px rgba(15,23,42,.05)",

          minWidth: 520,

        }}
      >

        <Box
          sx={{

            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            mb: 2,

          }}
        >

          <Typography
            sx={{

              fontWeight: 800,

              fontSize: "1.05rem",

            }}
          >

            Working Days

          </Typography>

          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() =>
              setOpen(true)
            }
          >

            Update

          </Button>

        </Box>

        <Box
          sx={{

            display: "flex",

            justifyContent:
              "space-between",

          }}
        >

          {days.map((day) => (

            <Box
              key={day.key}
              sx={{

                display: "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                gap: 1,

              }}
            >

              <Typography
                sx={{

                  fontWeight: 700,

                  fontSize:
                    ".85rem",

                  color:
                    "#475569",

                }}
              >

                {day.label}

              </Typography>

              <Box
                sx={{

                  width: 18,

                  height: 18,

                  borderRadius:
                    "50%",

                  backgroundColor:
                    workingDays[
                      day.key
                    ]
                      ? "#10B981"
                      : "#CBD5E1",

                  border:
                    "2px solid #fff",

                  boxShadow:
                    "0 2px 8px rgba(0,0,0,.12)",

                }}
              />

            </Box>

          ))}

        </Box>

      </Paper>

      <UpdateWorkingDaysDialog
        open={open}
        handleClose={() =>
          setOpen(false)
        }
        refresh={
          fetchWorkingDays
        }
        workingDays={
          workingDays
        }
      />

    </>

  );

}