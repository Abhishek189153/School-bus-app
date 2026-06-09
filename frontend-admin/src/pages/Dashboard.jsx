import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  School,
  DirectionsBus,
  Person,
  Route,
  Groups,
} from "@mui/icons-material";

import {
  getDashboardStats,
} from "../services/dashboard.service";

const Dashboard = () => {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {
  console.log(
    "Stats Updated:",
    stats
  );
}, [stats]);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchStats =
      async () => {

        try {

          const data =
            await getDashboardStats();

            setStats(data.stats);

        } catch (error) {

          console.log(error);

        }
      };

    fetchStats();

  }, []);

  if (!stats) {
    return <h2>Loading...</h2>;
  }

  const cards = [
    {
      title: "Students",
      value: stats.students,
       path: "/students",
      icon: <School fontSize="large" />,
      color:
        "linear-gradient(135deg,#667eea,#764ba2)",
    },
    {
      title: "Drivers",
      value: stats.drivers,
       path: "/drivers",
      icon: <Person fontSize="large" />,
      color:
        "linear-gradient(135deg,#11998e,#38ef7d)",
    },
    {
      title: "Parents",
      value: stats.parents,
       path: "/parents",
      icon: <Groups fontSize="large" />,
      color:
        "linear-gradient(135deg,#ff9966,#ff5e62)",
    },
    {
      title: "Buses",
      value: stats.buses,
       path: "/buses",
      icon:
        <DirectionsBus fontSize="large" />,
      color:
        "linear-gradient(135deg,#36d1dc,#5b86e5)",
    },
    {
      title: "Routes",
      value: stats.routes,
       path: "/routes",
      icon: <Route fontSize="large" />,
      color:
        "linear-gradient(135deg,#f7971e,#ffd200)",
    },
  ];

  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Welcome to Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Manage students, buses,
        drivers and routes from
        one place.
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {cards.map((card) => (

         <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2
          }}
          key={card.title}
        >

            <Card
              onClick={() =>
                navigate(card.path)
              }
              sx={{
                cursor: "pointer",
                background:
                card.color,
                color: "#fff",
                borderRadius: 4,
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.15)",
                transition:
                  "0.3s",
               "&:hover": {
                transform: "translateY(-8px)",
                boxShadow:
                  "0 15px 35px rgba(0,0,0,0.25)",
              },
              }}
            >

              <CardContent>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                  }}
                >

                  <Box>

                    <Typography
                      variant="h6"
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight="bold"
                    >
                      {card.value}
                    </Typography>

                  </Box>

                  {card.icon}

                </Box>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

      <Typography
        variant="h5"
        sx={{
          mt: 5,
          mb: 3,
          fontWeight: 700,
        }}
      >
        🚍 Transportation Status
      </Typography>

        <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: "#e8f5e9",
              }}
            >
              <CardContent>

                <Typography>
                  ✅ Assigned Students
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight="bold"
                >
                  {stats.studentsAssigned}
                </Typography>

              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 4,
              bgcolor: "#e3f2fd",
            }}
          >
            <CardContent>

              <Typography>
                👨‍✈️ Assigned Drivers
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
              >
                {stats.driversAssigned}
              </Typography>

            </CardContent>
          </Card>
        </Grid>


        <Grid size={{ xs: 12, md: 4 }}>
      <Card
        sx={{
          borderRadius: 4,
          bgcolor: "#e8f5e9",
        }}
      >
        <CardContent>

          <Typography>
            🚌 Active Buses
          </Typography>

          <Typography
            variant="h3"
            fontWeight="bold"
          >
            {stats.activeBuses}
          </Typography>

        </CardContent>
      </Card>
    </Grid>


         <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: "#fff8e1",
              }}
            >
              <CardContent>

                <Typography>
                  ⚠️ Unassigned Students
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight="bold"
                >
                  {stats.studentsUnassigned}
                </Typography>

              </CardContent>
            </Card>
          </Grid>

         

        <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            borderRadius: 4,
            bgcolor: "#ffebee",
          }}
        >
          <CardContent>

            <Typography>
              ⚠️ Unassigned Drivers
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
            >
              {stats.driversUnassigned}
            </Typography>

          </CardContent>
        </Card>
      </Grid>

      

    <Grid size={{ xs: 12, md: 4 }}>
    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "#ffebee",
      }}
    >
      <CardContent>

        <Typography>
          🔴 Inactive Buses
        </Typography>

        <Typography
          variant="h3"
          fontWeight="bold"
        >
          {stats.inactiveBuses}
        </Typography>

      </CardContent>
    </Card>
  </Grid>

      </Grid>

    </Box>
  );
};

export default Dashboard;