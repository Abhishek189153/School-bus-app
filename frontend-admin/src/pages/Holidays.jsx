import React, { useEffect, useState } from "react";

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
  Box,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  TablePagination,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddHolidayModal from "../components/AddHolidayModal";

import {
  getHolidays,
  deleteHoliday,
} from "../services/holiday.service";

const Holidays = () => {

  const [holidays, setHolidays] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [open, setOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchHolidays = async () => {

    try {

      const data = await getHolidays();

      setHolidays(data.holidays || []);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchHolidays();

  }, []);

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete Holiday?"
      );

    if (!confirmDelete)
      return;

    try {

      const response =
        await deleteHoliday(id);

      setSnackbar({

        open: true,

        message:
          response.message,

        severity:
          "success",

      });

      fetchHolidays();

    } catch (error) {

      setSnackbar({

        open: true,

        message:
          error.response?.data?.message ||
          "Unable to delete holiday",

        severity:
          "error",

      });

    }

  };

  const filteredHolidays =
    holidays.filter(
      (holiday) =>
        holiday.title
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        holiday.date.includes(
          searchTerm
        )
    );

  const paginatedHolidays =
    filteredHolidays.slice(
      page * rowsPerPage,
      page * rowsPerPage +
        rowsPerPage
    );

  return (

    <Box
      sx={{
        p: 3,
        backgroundColor:
          "#f8fafc",
        minHeight: "100vh",
      }}
    >

      {/* Header */}

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: "16px",
          border:
            "1px solid #e2e8f0",
          backgroundColor:
            "#ffffff",
        }}
      >

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1.5,
            }}
          >

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color:
                  "#0f172a",
              }}
            >
              Holiday Management
            </Typography>

            <Chip
              label={`${filteredHolidays.length} Total`}
              size="small"
              sx={{
                fontWeight: 600,
                backgroundColor:
                  "#eff6ff",
                color:
                  "#1d4ed8",
                borderRadius:
                  "8px",
              }}
            />

          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 2,
              flexWrap:
                "wrap",
            }}
          >

            <TextField
              placeholder="Search holiday..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color:
                          "#94a3b8",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: {
                  xs: "100%",
                  sm: 320,
                },
                "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      "10px",
                    backgroundColor:
                      "#ffffff",
                  },
              }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                setOpen(true)
              }
              sx={{
                borderRadius:
                  "10px",
                textTransform:
                  "none",
                fontWeight: 600,
                backgroundColor:
                  "#2563eb",
              }}
            >
              Add Holiday
            </Button>

          </Box>

        </Box>

      </Paper>

      {/* Table */}

      <Paper
        elevation={0}
        sx={{
          borderRadius:
            "16px",
          border:
            "1px solid #e2e8f0",
          overflow:
            "hidden",
        }}
      >

        <TableContainer>

          <Table>

            <TableHead>

              <TableRow
                sx={{
                  backgroundColor:
                    "#f1f5f9",
                }}
              >

                <TableCell
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  #
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Holiday
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Date
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Actions
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

                              {paginatedHolidays.length > 0 ? (

                paginatedHolidays.map(
                  (holiday, index) => (

                    <TableRow
                      key={holiday._id}
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            "#f8fafc",
                        },
                      }}
                    >

                      <TableCell>
                        {page * rowsPerPage +
                          index +
                          1}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {holiday.title}
                      </TableCell>

                      <TableCell>

                        {new Date(
                          holiday.date
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </TableCell>

                      <TableCell
                        align="right"
                      >

                        <Tooltip title="Delete">

                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDelete(
                                holiday._id
                              )
                            }
                          >

                            <DeleteOutlinedIcon />

                          </IconButton>

                        </Tooltip>

                      </TableCell>

                    </TableRow>

                  )
                )

              ) : (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      py: 5,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      No Holidays Found
                    </Typography>

                  </TableCell>

                </TableRow>

              )}

            </TableBody>

          </Table>

        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[
            10,
            25,
            50,
          ]}
          component="div"
          count={
            filteredHolidays.length
          }
          rowsPerPage={
            rowsPerPage
          }
          page={page}
          onPageChange={(
            event,
            newPage
          ) =>
            setPage(newPage)
          }
          onRowsPerPageChange={(
            event
          ) => {

            setRowsPerPage(
              parseInt(
                event.target.value,
                10
              )
            );

            setPage(0);

          }}
        />

      </Paper>

      <AddHolidayModal
  open={open}
  handleClose={() => setOpen(false)}
  refreshHolidays={fetchHolidays}
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
          severity={
            snackbar.severity
          }
          variant="filled"
        >
          {snackbar.message}
        </Alert>

      </Snackbar>

      {/* AddHolidayModal will be added next */}

    </Box>

  );

};

export default Holidays;