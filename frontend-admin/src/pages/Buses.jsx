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
  TextField,
  Box,
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

  const [searchTerm, setSearchTerm] =
    useState("");

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


    const filteredBuses =
      buses.filter(
        (bus) =>
          (
            (bus.busNumber || "") +
            " " +
            (bus.vehicleNumber || "")
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
          Buses
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            setOpen(true)
          }
        >
          Add Bus
        </Button>

        <TextField
          label="Search Bus Number or Vehicle Number"
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

            {filteredBuses.map(
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