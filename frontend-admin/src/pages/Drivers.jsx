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
  getDrivers,
  deleteDriver,
} from "../services/driver.service";

import AddDriverModal from "../components/AddDriverModal";
import EditDriverModal from "../components/EditDriverModal";

const Drivers = () => {

  const [drivers, setDrivers] =
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

  const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Delete driver?"
    );

  if (!confirmDelete)
    return;

  try {

    const response =
      await deleteDriver(id);

    setSnackbar({
      open: true,
      message:
        response.message,
      severity: "success",
    });

    fetchDrivers();

  } catch (error) {

    setSnackbar({
      open: true,
      message:
        error.response?.data
          ?.message ||
        "Assigned driver cannot be deleted, unassignfirst",
      severity: "error",
    });

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
            Drivers
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              setOpen(true)
            }
          >
            Add Driver
          </Button>

          <TextField
            label="Search Driver Name or Phone"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
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
                Name
              </TableCell>

              <TableCell>
                Phone
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

            {drivers
              .filter(
                (driver) =>
                  driver.name
                    ?.toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    ) ||

                  driver.phone
                    ?.includes(searchTerm)
              )
              .map(
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

                    <Typography
                      sx={{
                        color:
                          driver.isAssigned
                            ? "green"
                            : "red",
                        fontWeight: "normal",
                      }}
                    >
                      {
                        driver.isAssigned
                          ? `🟢 Active (${driver.assignedBus})`
                          : "🔴 Inactive"
                      }
                    </Typography>

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

export default Drivers;