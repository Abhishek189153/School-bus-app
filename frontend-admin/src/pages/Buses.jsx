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
  getBuses,
  deleteBus,
} from "../services/bus.service";

import AddBusModal from "../components/AddBusModal";
import EditBusModal from "../components/EditBusModal";

const Buses = () => {

  const [buses, setBuses] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedBus,
    setSelectedBus] =
    useState(null);

  const fetchBuses =
    async () => {

      try {

        const data =
          await getBuses();

        setBuses(
          data.buses
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete bus?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteBus(id);

        fetchBuses();

      } catch (error) {

        console.log(error);

      }
    };

  const handleEdit =
    (bus) => {

      setSelectedBus(
        bus
      );

      setEditOpen(true);
    };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Buses
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() =>
          setOpen(true)
        }
      >
        Add Bus
      </Button>

      <TableContainer
        component={Paper}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Bus Number
              </TableCell>

              <TableCell>
                Vehicle Number
              </TableCell>

              <TableCell>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {buses.map(
              (bus) => (

                <TableRow
                  key={bus._id}
                >

                  <TableCell>
                    {bus.busNumber}
                  </TableCell>

                  <TableCell>
                    {bus.vehicleNumber}
                  </TableCell>

                  <TableCell>

                    <Button
                      onClick={() =>
                        handleEdit(bus)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      color="error"
                      onClick={() =>
                        handleDelete(
                          bus._id
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

      <AddBusModal
        open={open}
        handleClose={() =>
          setOpen(false)
        }
        refreshBuses={
          fetchBuses
        }
      />

      <EditBusModal
        open={editOpen}
        handleClose={() =>
          setEditOpen(false)
        }
        bus={selectedBus}
        refreshBuses={
          fetchBuses
        }
      />

    </>
  );
};

export default Buses;