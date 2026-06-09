import {
  useEffect,
  useState,
} from "react";

import {
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  getDrivers,
} from "../services/driver.service";

import {
  getBuses,
} from "../services/bus.service";

import {
  getRoutes,
} from "../services/route.service";

import {
  getStudents,
} from "../services/student.service";

import {
  assignDriverToBus,
  assignRouteToBus,
  assignStudentToBus,
} from "../services/assignment.service";



const Assignments = () => {

  const [drivers, setDrivers] =
    useState([]);

  const [snackbar, setSnackbar] =
  useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [buses, setBuses] =
    useState([]);

  const [routes, setRoutes] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [driverBus,
    setDriverBus] =
    useState("");

  const [driverId,
    setDriverId] =
    useState("");

  const [routeBus,
    setRouteBus] =
    useState("");

  const [routeId,
    setRouteId] =
    useState("");

  const [studentBus,
    setStudentBus] =
    useState("");

  const [studentId,
    setStudentId] =
    useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      try {

        const [
          driversData,
          busesData,
          routesData,
          studentsData,
        ] = await Promise.all([
          getDrivers(),
          getBuses(),
          getRoutes(),
          getStudents(),
        ]);

        setDrivers(
          driversData.drivers
        );

        setBuses(
          busesData.buses
        );

        setRoutes(
          routesData.routes
        );

        setStudents(
          studentsData.students
        );

      } catch (error) {

        console.log(error);

      }
    };


    const handleAssignDriver =
  async () => {

    try {

      await assignDriverToBus({
        busId: driverBus,
        driverId,
      });

      setSnackbar({
        open: true,
        message:
          "Driver assigned successfully",
        severity: "success",
      });

    } catch (error) {

      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Something went wrong",
        severity: "error",
      });

    }
};

const handleAssignRoute =
  async () => {

    try {

      await assignRouteToBus({
        busId: routeBus,
        routeId,
      });

      setSnackbar({
        open: true,
        message:
          "Route assigned successfully",
        severity: "success",
      });

    } catch (error) {

      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Something went wrong",
        severity: "error",
      });

    }
};

const handleAssignStudent =
  async () => {

    try {

      await assignStudentToBus({
        studentId,
        busId: studentBus,
      });

      setSnackbar({
        open: true,
        message:
          "Student assigned successfully",
        severity: "success",
      });

    } catch (error) {

      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Something went wrong",
        severity: "error",
      });

    }
};



  return (
    <>

      <Typography
        variant="h4"
        gutterBottom
      >
        Assignments
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {/* Driver Assignment */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >

          <Paper
            sx={{
              p: 3,
            }}
          >

            <Typography
              variant="h6"
            >
              Assign Driver
            </Typography>

            <Autocomplete
              sx={{ mt: 2 }}
              options={buses}
              getOptionLabel={(option) =>
                `${option.busNumber} - ${option.vehicleNumber || "No Vehicle"}`
              }
              onChange={(_, value) =>
                setDriverBus(
                  value?._id || ""
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Bus"
                />
              )}
            />

           <Autocomplete
              sx={{ mt: 2 }}
              options={drivers}
              getOptionLabel={(option) =>
                `${option.name} - ${option.phone}`
              }
              onChange={(_, value) =>
                setDriverId(
                  value?._id || ""
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Driver"
                />
              )}
            />

            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleAssignDriver}
            >
              Assign Driver
            </Button>

          </Paper>

        </Grid>

        {/* Route Assignment */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >

          <Paper sx={{ p: 3 }}>

            <Typography
              variant="h6"
            >
              Assign Route
            </Typography>

            <Autocomplete
  sx={{ mt: 2 }}
  options={buses}
  getOptionLabel={(option) =>
    `${option.busNumber} - ${option.vehicleNumber || "No Vehicle"}`
  }
  onChange={(_, value) =>
    setRouteBus(
      value?._id || ""
    )
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Search Bus"
    />
  )}
/>

            <Autocomplete
              sx={{ mt: 2 }}
              options={routes}
              getOptionLabel={(option) =>
              `${option.routeName} - ${
                option.stops
                  ?.slice(0, 3)
                  .map((stop) => stop.stopName)
                  .join(", ") || "No Stops"
              }${
                option.stops?.length > 3
                  ? "..."
                  : ""
              }`
            }
              onChange={(_, value) =>
                setRouteId(
                  value?._id || ""
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Route"
                />
              )}
            />
            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleAssignRoute}
            >
              Assign Route
            </Button>

          </Paper>

        </Grid>

        {/* Student Assignment */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >

          <Paper sx={{ p: 3 }}>

            <Typography
              variant="h6"
            >
              Assign Student
            </Typography>

            <Autocomplete
              sx={{ mt: 2 }}
              options={students}
              getOptionLabel={(option) =>
                `${option.admissionNumber || "N/A"} - ${option.name} - ${option.parentId?.name || "No Parent"}`
              }
              onChange={(_, value) =>
                setStudentId(
                  value?._id || ""
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Student"
                />
              )}
            />

            <Autocomplete
  sx={{ mt: 2 }}
  options={buses}
  getOptionLabel={(option) =>
    `${option.busNumber} - ${option.vehicleNumber || "No Vehicle"}`
  }
  onChange={(_, value) =>
    setStudentBus(
      value?._id || ""
    )
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Search Bus"
    />
  )}
/>

            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
             onClick={handleAssignStudent}
            >
              Assign Student
            </Button>

          </Paper>

        </Grid>

      </Grid>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>


    </>
  );
};

export default Assignments;