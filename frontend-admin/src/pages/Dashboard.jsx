import { useEffect, useState } from "react";

import {
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  getDashboardStats,
} from "../services/dashboard.service";

const Dashboard = () => {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {

    const fetchStats =
      async () => {

        try {

          const data =
            await getDashboardStats();

          setStats(data.data);

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
    },
    {
      title: "Drivers",
      value: stats.drivers,
    },
    {
      title: "Parents",
      value: stats.parents,
    },
    {
      title: "Buses",
      value: stats.buses,
    },
    {
      title: "Routes",
      value: stats.routes,
    },
  ];

  return (
    <Grid container spacing={3}>

      {cards.map((card) => (

        <Grid
          item
          xs={12}
          md={4}
          key={card.title}
        >

          <Card>

            <CardContent>

              <Typography
                variant="h6"
              >
                {card.title}
              </Typography>

              <Typography
                variant="h4"
              >
                {card.value}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      ))}

    </Grid>
  );
};

export default Dashboard;