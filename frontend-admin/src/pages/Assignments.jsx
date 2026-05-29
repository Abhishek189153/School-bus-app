import {
  useEffect,
  useState,
} from "react";

import {
  Paper,
  Typography,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
          item
          xs={12}
          md={4}
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

            <FormControl
              fullWidth
              sx={{ mt: 2 }}
            >

              <InputLabel>
                Bus
              </InputLabel>

              <Select
                value={driverBus}
                label="Bus"
                onChange={(e) =>
                  setDriverBus(
                    e.target.value
                  )
                }
              >

                {buses.map(
                  (bus) => (

                    <MenuItem
                      key={bus._id}
                      value={bus._id}
                    >
                      {
                        bus.busNumber
                      }
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>

            <FormControl
              fullWidth
              sx={{ mt: 2 }}
            >

              <InputLabel>
                Driver
              </InputLabel>

              <Select
                value={driverId}
                label="Driver"
                onChange={(e) =>
                  setDriverId(
                    e.target.value
                  )
                }
              >

                {drivers.map(
                  (driver) => (

                    <MenuItem
                      key={driver._id}
                      value={driver._id}
                    >
                      {driver.name}
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>

            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() =>
                assignDriverToBus({
                  busId:
                    driverBus,
                  driverId,
                })
              }
            >
              Assign Driver
            </Button>

          </Paper>

        </Grid>

        {/* Route Assignment */}

        <Grid
          item
          xs={12}
          md={4}
        >

          <Paper sx={{ p: 3 }}>

            <Typography
              variant="h6"
            >
              Assign Route
            </Typography>

            <FormControl
              fullWidth
              sx={{ mt: 2 }}
            >

              <InputLabel>
                Bus
              </InputLabel>

              <Select
                value={routeBus}
                label="Bus"
                onChange={(e) =>
                  setRouteBus(
                    e.target.value
                  )
                }
              >

                {buses.map(
                  (bus) => (

                    <MenuItem
                      key={bus._id}
                      value={bus._id}
                    >
                      {
                        bus.busNumber
                      }
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>

            <FormControl
              fullWidth
              sx={{ mt: 2 }}
            >

              <InputLabel>
                Route
              </InputLabel>

              <Select
                value={routeId}
                label="Route"
                onChange={(e) =>
                  setRouteId(
                    e.target.value
                  )
                }
              >

                {routes.map(
                  (route) => (

                    <MenuItem
                      key={route._id}
                      value={route._id}
                    >
                      {
                        route.routeName
                      }
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>

            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() =>
                assignRouteToBus({
                  busId:
                    routeBus,
                  routeId,
                })
              }
            >
              Assign Route
            </Button>

          </Paper>

        </Grid>

        {/* Student Assignment */}

        <Grid
          item
          xs={12}
          md={4}
        >

          <Paper sx={{ p: 3 }}>

            <Typography
              variant="h6"
            >
              Assign Student
            </Typography>

            <FormControl
              fullWidth
              sx={{ mt: 2 }}
            >

              <InputLabel>
                Student
              </InputLabel>

              <Select
                value={studentId}
                label="Student"
                onChange={(e) =>
                  setStudentId(
                    e.target.value
                  )
                }
              >

                {students.map(
                  (student) => (

                    <MenuItem
                      key={student._id}
                      value={student._id}
                    >
                      {
                        student.name
                      }
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>

            <FormControl
              fullWidth
              sx={{ mt: 2 }}
            >

              <InputLabel>
                Bus
              </InputLabel>

              <Select
                value={studentBus}
                label="Bus"
                onChange={(e) =>
                  setStudentBus(
                    e.target.value
                  )
                }
              >

                {buses.map(
                  (bus) => (

                    <MenuItem
                      key={bus._id}
                      value={bus._id}
                    >
                      {
                        bus.busNumber
                      }
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>

            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() =>
                assignStudentToBus({
                  studentId,
                  busId:
                    studentBus,
                })
              }
            >
              Assign Student
            </Button>

          </Paper>

        </Grid>

      </Grid>

    </>
  );
};

export default Assignments;