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
  getDrivers,
  deleteDriver,
} from "../services/driver.service";

import AddDriverModal from "../components/AddDriverModal";
import EditDriverModal from "../components/EditDriverModal";

const Drivers = () => {

  const [drivers, setDrivers] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedDriver,
    setSelectedDriver] =
    useState(null);

  const fetchDrivers =
    async () => {

      try {

        const data =
          await getDrivers();

        setDrivers(
          data.drivers
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete driver?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDriver(id);

        fetchDrivers();

      } catch (error) {

        console.log(error);

      }
    };

  const handleEdit =
    (driver) => {

      setSelectedDriver(
        driver
      );

      setEditOpen(true);
    };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Drivers
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() =>
          setOpen(true)
        }
      >
        Add Driver
      </Button>

      <TableContainer
        component={Paper}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Name
              </TableCell>

              <TableCell>
                Phone
              </TableCell>

              <TableCell>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {drivers.map(
              (driver) => (

                <TableRow
                  key={driver._id}
                >

                  <TableCell>
                    {driver.name}
                  </TableCell>

                  <TableCell>
                    {driver.phone}
                  </TableCell>

                  <TableCell>

                    <Button
                      onClick={() =>
                        handleEdit(
                          driver
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      color="error"
                      onClick={() =>
                        handleDelete(
                          driver._id
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

      <AddDriverModal
        open={open}
        handleClose={() =>
          setOpen(false)
        }
        refreshDrivers={
          fetchDrivers
        }
      />

      <EditDriverModal
        open={editOpen}
        handleClose={() =>
          setEditOpen(false)
        }
        driver={selectedDriver}
        refreshDrivers={
          fetchDrivers
        }
      />

    </>
  );
};

export default Drivers;