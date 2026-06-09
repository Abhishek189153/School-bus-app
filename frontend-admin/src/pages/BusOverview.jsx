import {
  useEffect,
  useState,
} from "react";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button
} from "@mui/material";

import {
  getBusOverview,
} from "../services/busOverview.service";

import {
  unassignDriverFromBus,
  unassignRouteFromBus
} from "../services/assignment.service";

const BusOverview = () => {

  const [buses, setBuses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);



  const handleUnassignDriver =
    async (busId) => {

        const confirmAction =
            window.confirm(
                "Unassign driver?"
            );

        if (!confirmAction)
            return;

        try {

            await
            unassignDriverFromBus(
                busId
            );

            fetchBusOverview();

            alert(
                "Driver unassigned successfully"
            );

        } catch (error) {

            alert(
                error.response?.data?.message
            );

        }
    };  

  const handleUnassignRoute =
    async (busId, routeId) => {

        const confirmAction =
            window.confirm(
                "Unassign route?"
            );

        if (!confirmAction)
            return;

        try {

            await unassignRouteFromBus(
                busId, routeId
            );

            fetchBusOverview();

            alert(
                "Route unassigned successfully"
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }
    };  

  const fetchBusOverview =
    async () => {

      try {

        const data =
          await getBusOverview();

          console.log(data);

        setBuses(
          data.buses
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    fetchBusOverview();

  }, []);

  if (loading) {

    return (
      <CircularProgress />
    );

  }

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Bus Overview
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {buses.map((bus) => {

  const totalStudents =
    bus.routeStudentCounts?.reduce(
      (sum, route) =>
        sum + route.count,
      0
    ) || 0;

  return (

          

          <Grid
            xs={12}
            md={4}
            key={bus._id}
          >

            <Card
              sx={{
                border:
                  bus.driverId &&
                  (
                    bus.routeId ||
                    bus.additionalRoutes?.length > 0
                  ) &&
                  totalStudents > 0
                    ? "2px solid #4caf50"
                    : "2px solid #f44336",

                borderRadius: 6,
                minHeight: 280,
                
              }}
            >

            <CardContent
              sx={{
                
                display: "flex",
                flexDirection: "column",
              }}
            >

              {/* Header */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom: 20,
                }}
              >
                <Typography
                  variant="h5"
                >
                  {bus.busNumber}
                </Typography>

                <Typography
                  sx={{
                    color:
                      bus.driverId &&
                      (
                        bus.routeId ||
                        bus.additionalRoutes?.length > 0
                      ) &&
                       totalStudents > 0
                        ? "green"
                        : "red",

                    fontWeight:
                      "bold",
                  }}
                >
                  {
                    bus.driverId &&
                    (
                      bus.routeId ||
                      bus.additionalRoutes?.length > 0
                    ) &&
                    totalStudents > 0
                      ? "Active"
                      : "Inactive"
                  }
                </Typography>
              </div>

              {/* Vehicle */}

              <Typography
                sx={{
                  mb: 2,
                }}
              >
                Vehicle No:
                {" "}
                {
                  bus.vehicleNumber ||
                  "N/A"
                }
              </Typography>

            {/* Driver */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Typography>
                Driver:
                {" "}
                {
                  bus.driverId?.name ||
                  "Not Assigned"
                }
              </Typography>

              {
                bus.driverId && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      handleUnassignDriver(
                        bus._id
                      )
                    }
                  >
                    Unassign
                  </Button>
                )
              }
            </div>

{/* Routes */}

            <div
              style={{
                marginBottom: 15,
              }}
            >

              {bus.routeId && (

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                {bus.routeId.routeName}
                {" "}
                (
                {
                  bus.routeStudentCounts?.find(
                    r =>
                      r.routeId ===
                      bus.routeId._id
                  )?.count || 0
                }
                )
              </Typography>

                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      handleUnassignRoute(
                        bus._id,
                        bus.routeId._id
                      )
                    }
                  >
                    Unassign
                  </Button>
                </div>

              )}

              {bus.additionalRoutes?.map(
                (item) => (

                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {item.routeId?.routeName}
                      {" "}
                      (
                      {
                        bus.routeStudentCounts?.find(
                          r =>
                            r.routeId ===
                            item.routeId._id
                        )?.count || 0
                      }
                      )
                    </Typography>

                    <Button
                      size="small"
                      color="error"
                      onClick={() =>
                        handleUnassignRoute(
                          bus._id,
                          item.routeId._id
                        )
                      }
                    >
                      Unassign
                    </Button>
                  </div>

                )
              )}

            </div>

              

            </CardContent>

            </Card>

          </Grid>


              
        );
    })}

      </Grid>
    </>
  );
};

export default BusOverview;