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

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete route?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteRoute(id);

        fetchRoutes();

      } catch (error) {

        console.log(error);

      }
    };

  const handleEdit =
    (route) => {

      setSelectedRoute(
        route
      );

      setEditOpen(true);
    };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Routes
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() =>
          setOpen(true)
        }
      >
        Add Route
      </Button>

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
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {routes.map(
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

    </>
  );
};

export default Routes;