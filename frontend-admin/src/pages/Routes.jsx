import {
  useEffect,
  useState,
} from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Box
} from "@mui/material";

import {
  getRoutes,
  deleteRoute,
} from "../services/route.service";

import AddRouteModal from "../components/AddRouteModal";
import EditRouteModal from "../components/EditRouteModal";

const Routes = () => {

  const [routes, setRoutes] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [snackbar, setSnackbar] =
  useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [open, setOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedRoute,
    setSelectedRoute] =
    useState(null);

  const fetchRoutes =
    async () => {

      try {

        const data =
          await getRoutes();

        setRoutes(
          data.routes
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Delete route?"
    );

  if (!confirmDelete)
    return;

  try {

    const response =
      await deleteRoute(id);

    setSnackbar({
      open: true,
      message:
        response.message,
      severity: "success",
    });

    fetchRoutes();

  } catch (error) {

    setSnackbar({
      open: true,
      message:
        error.response?.data
          ?.message ||
        "Assigned route cannot be deleted, unassign first",
      severity: "error",
    });

  }
};

  const handleEdit =
    (route) => {

      setSelectedRoute(
        route
      );

      setEditOpen(true);
    };


  const filteredRoutes =
  routes.filter(
    (route) =>
      (
        route.routeName +
        " " +
        route.stops
          ?.map(
            (stop) =>
              stop.stopName
          )
          .join(" ")
      )
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
  );

  return (
    <>


          <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          mb: 2,
        }}
      >

        <Typography
          variant="h4"
        >
          Routes
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            setOpen(true)
          }
        >
          Add Route
        </Button>

        <TextField
          label="Search Route or Stop"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          size="small"
          sx={{
            width: 950,

            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",

              "& fieldset": {
                borderColor: "#080000",
                borderWidth: "2px",
              },

              "&:hover fieldset": {
                borderColor: "#1976d2",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
                borderWidth: "2px",
              },
            },
          }}
        />

      </Box>

      <TableContainer
        component={Paper}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Route Name
              </TableCell>

              <TableCell>
                Stops
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {filteredRoutes.map(
            (route) => (

                <TableRow
                  key={route._id}
                >

                  <TableCell>
                    {route.routeName}
                  </TableCell>

                  <TableCell>
                    {route.stops
                      ?.map(
                        (s) =>
                          s.stopName
                      )
                      .join(", ")}
                  </TableCell>


                  <TableCell>

                    <Typography
                      sx={{
                        color:
                          route.isAssigned
                            ? "green"
                            : "red",
                        fontWeight: "normal",
                      }}
                    >
                      {
                        route.isAssigned
                          ? `🟢 Active`
                          : "🔴 Inactive"
                      }
                    </Typography>

                  </TableCell>    

                  <TableCell>

                    <Button
                      onClick={() =>
                        handleEdit(
                          route
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      color="error"
                      onClick={() =>
                        handleDelete(
                          route._id
                        )
                      }
                    >
                      Delete
                    </Button>

                  </TableCell>

                </TableRow>

              )
            )}

          </TableBody>

        </Table>

      </TableContainer>

      <AddRouteModal
        open={open}
        handleClose={() =>
          setOpen(false)
        }
        refreshRoutes={
          fetchRoutes
        }
      />

      <EditRouteModal
        open={editOpen}
        handleClose={() =>
          setEditOpen(false)
        }
        route={selectedRoute}
        refreshRoutes={
          fetchRoutes
        }
      />

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

export default Routes;