import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useEffect, useState } from "react";

import { updateWorkingDays } from "../services/workingDay.service";

export default function UpdateWorkingDaysDialog({

  open,

  handleClose,

  refresh,

  workingDays,

}) {

  const [form, setForm] = useState({});

  useEffect(() => {

    if (workingDays) {

      setForm({

        monday: workingDays.monday,

        tuesday: workingDays.tuesday,

        wednesday: workingDays.wednesday,

        thursday: workingDays.thursday,

        friday: workingDays.friday,

        saturday: workingDays.saturday,

        sunday: workingDays.sunday,

      });

    }

  }, [workingDays]);

  const handleToggle = (day) => {

    setForm({

      ...form,

      [day]: !form[day],

    });

  };

  const handleSave = async () => {

    await updateWorkingDays(form);

    refresh();

    handleClose();

  };

  const days = [

    {
      label: "Monday",
      key: "monday",
    },

    {
      label: "Tuesday",
      key: "tuesday",
    },

    {
      label: "Wednesday",
      key: "wednesday",
    },

    {
      label: "Thursday",
      key: "thursday",
    },

    {
      label: "Friday",
      key: "friday",
    },

    {
      label: "Saturday",
      key: "saturday",
    },

    {
      label: "Sunday",
      key: "sunday",
    },

  ];

  return (

    <Dialog

      open={open}

      onClose={handleClose}

      fullWidth

      maxWidth="sm"

      PaperProps={{

        sx:{

          borderRadius:"22px",

          overflow:"hidden",

        }

      }}

    >

      <DialogTitle

        sx={{

          display:"flex",

          alignItems:"center",

          gap:1.5,

          borderBottom:"1px solid #EEF2F7",

          py:2,

        }}

      >

        <CalendarMonthRoundedIcon

          sx={{

            color:"#6366F1",

            fontSize:30,

          }}

        />

        <Box>

          <Typography

            sx={{

              fontWeight:800,

              fontSize:"1.2rem",

            }}

          >

            Working Schedule

          </Typography>

          <Typography

            sx={{

              color:"#64748B",

              fontSize:13,

            }}

          >

            Select the days when your school operates.

          </Typography>

        </Box>

      </DialogTitle>

      <DialogContent

        sx={{

          py:3,

        }}

      >

        <Box

          sx={{

            display:"grid",

            gridTemplateColumns:{

              xs:"1fr",

              sm:"1fr 1fr",

            },

            gap:2,

          }}

        >

          {

            days.map((day)=>{

              const active=form[day.key];

              return(

                <Paper

                  key={day.key}

                  elevation={0}

                  onClick={()=>handleToggle(day.key)}

                  sx={{

                    p:2,

                    cursor:"pointer",

                    borderRadius:"16px",

                    border:

                      active

                      ?

                      "2px solid #10B981"

                      :

                      "2px solid #E2E8F0",

                    background:

                      active

                      ?

                      "#F0FDF4"

                      :

                      "#FFFFFF",

                    transition:".25s",

                    "&:hover":{

                      transform:"translateY(-2px)",

                      boxShadow:

                      "0 10px 20px rgba(15,23,42,.08)"

                    }

                  }}

                >

                  <Box

                    sx={{

                      display:"flex",

                      justifyContent:"space-between",

                      alignItems:"center",

                    }}

                  >

                    <Typography

                      sx={{

                        fontWeight:700,

                        color:"#0F172A",

                      }}

                    >

                      {day.label}

                    </Typography>

                    {

                      active ?

                      <CheckRoundedIcon

                        sx={{

                          color:"#10B981",

                          fontSize:24,

                        }}

                      />

                      :

                      <CloseRoundedIcon

                        sx={{

                          color:"#94A3B8",

                          fontSize:22,

                        }}

                      />

                    }

                  </Box>

                  <Typography

                    sx={{

                      mt:1,

                      fontSize:13,

                      color:"#64748B",

                    }}

                  >

                    {

                      active

                      ?

                      "School will remain operational."

                      :

                      "School will remain closed."

                    }

                  </Typography>

                </Paper>

              )

            })

          }

        </Box>

      </DialogContent>

      <DialogActions

        sx={{

          px:3,

          py:2,

          borderTop:"1px solid #EEF2F7",

        }}

      >

        <Button

          onClick={handleClose}

          sx={{

            borderRadius:"10px",

            textTransform:"none",

            px:3,

          }}

        >

          Cancel

        </Button>

        <Button

          variant="contained"

          onClick={handleSave}

          sx={{

            borderRadius:"12px",

            px:4,

            textTransform:"none",

            fontWeight:700,

            background:

            "linear-gradient(135deg,#6366F1,#4F46E5)",

            boxShadow:

            "0 8px 18px rgba(99,102,241,.30)",

            "&:hover":{

              background:

              "linear-gradient(135deg,#4F46E5,#4338CA)"

            }

          }}

        >

          Save Changes

        </Button>

      </DialogActions>

    </Dialog>

  );

}