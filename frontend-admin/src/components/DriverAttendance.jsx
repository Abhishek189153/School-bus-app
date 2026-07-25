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
  TextField,
  Box,
  Chip,
  MenuItem,
  InputAdornment,
  TablePagination,
  Grid,
} from "@mui/material";

// Direct file path imports to prevent Vite bundling/resolution errors
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getBuses } from "../services/bus.service";
import { getDriverAttendanceHistory } from "../services/driverAttendance.service";

export default function DriverAttendance() {
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [busId, setBusId] = useState("");
  const [search, setSearch] = useState("");

  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });

  const loadData = async () => {
    try {
      const data = await getDriverAttendanceHistory(date, busId, search);

      if (data && data.success) {
        setDrivers(data.drivers || []);
        setSummary({
          total: data.total || 0,
          present: data.present || 0,
          absent: data.absent || 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadBuses = async () => {
    try {
      const data = await getBuses();
      setBuses(data.buses || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial load for buses list
  useEffect(() => {
    loadBuses();
  }, []);

  // Auto-refetch when date, busId, or search term changes
  useEffect(() => {
    loadData();
    setPage(0); // Reset page on filter/search change
  }, [date, busId, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Live client-side auto-search fallback across all fields
  const filteredDrivers = drivers.filter((driver) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase();
    const name = (driver.name || "").toLowerCase();
    const phone = (driver.phone || "").toLowerCase();
    const busNumber = (driver.busNumber || "").toLowerCase();
    const status = (driver.status || "").toLowerCase();

    return (
      name.includes(query) ||
      phone.includes(query) ||
      busNumber.includes(query) ||
      status.includes(query)
    );
  });

  const exportToExcel = () => {
    const excelData = filteredDrivers.map((driver) => ({
      Driver: driver.name || "N/A",
      Phone: driver.phone || "N/A",
      Bus: driver.busNumber || "N/A",
      DutyOn: driver.dutyOnTime
        ? new Date(driver.dutyOnTime).toLocaleTimeString()
        : "-",
      DutyOff: driver.dutyOffTime
        ? new Date(driver.dutyOffTime).toLocaleTimeString()
        : "-",
      Trips: driver.completedTrips ?? "-",
      Status: driver.status || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DriverAttendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      fileData,
      `Driver_Attendance_${new Date().toLocaleDateString().replaceAll("/", "-")}.xlsx`
    );
  };

  const paginatedDrivers = filteredDrivers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 0.5 }}>
      {/* Clean & Separated Summary Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 700, letterSpacing: "0.5px" }}
            >
              TOTAL DRIVERS
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
              {summary.total}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: "1px solid #bbf7d0",
              backgroundColor: "#f0fdf4",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#166534", fontWeight: 700, letterSpacing: "0.5px" }}
            >
              PRESENT
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#15803d" }}>
              {summary.present}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: "1px solid #fecaca",
              backgroundColor: "#fef2f2",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#991b1b", fontWeight: 700, letterSpacing: "0.5px" }}
            >
              ABSENT
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#dc2626" }}>
              {summary.absent}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter Control Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          {/* Date Picker */}
          <TextField
            label="Date"
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: { xs: "100%", sm: 160 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          />

          {/* Bus Selection Filter */}
          <TextField
            select
            label="Select Bus"
            size="small"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          >
            <MenuItem value="">All Buses</MenuItem>
            {buses.map((bus) => (
              <MenuItem key={bus._id} value={bus._id}>
                {bus.busNumber}
              </MenuItem>
            ))}
          </TextField>

          {/* Universal Auto-Search Field */}
          <TextField
            size="small"
            placeholder="Search driver name, phone or bus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flexGrow: 1,
              minWidth: 240,
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          />

          {/* Export to Excel */}
          <Button
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
            onClick={exportToExcel}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#16a34a",
              px: 2,
              py: 0.8,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#15803d" },
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Paper>

      {/* Styled Table Paper Wrapper */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                  }}
                >
                  Driver
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                  }}
                >
                  Phone
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                  }}
                >
                  Bus
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                  }}
                >
                  Duty On
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                  }}
                >
                  Duty Off
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                  }}
                >
                  Trips
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    pr: 3,
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedDrivers.length > 0 ? (
                paginatedDrivers.map((driver, index) => {
                  const isPresent = driver.status === "PRESENT";

                  return (
                    <TableRow
                      key={driver._id || index}
                      sx={{
                        "&:hover": { backgroundColor: "#f8fafc" },
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {/* Serial Number */}
                      <TableCell
                        sx={{
                          color: "#94a3b8",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>
                        {driver.name || "-"}
                      </TableCell>

                      <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                        {driver.phone || "-"}
                      </TableCell>

                      <TableCell>
                        {driver.busNumber ? (
                          <Chip
                            label={driver.busNumber}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              borderRadius: "6px",
                              backgroundColor: "#fef3c7",
                              color: "#92400e",
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell sx={{ color: "#64748b", fontWeight: 500 }}>
                        {driver.dutyOnTime
                          ? new Date(driver.dutyOnTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </TableCell>

                      <TableCell sx={{ color: "#64748b", fontWeight: 500 }}>
                        {driver.dutyOffTime
                          ? new Date(driver.dutyOffTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </TableCell>

                      <TableCell sx={{ color: "#475569", fontWeight: 600 }}>
                        {driver.completedTrips ?? 0}
                      </TableCell>

                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Chip
                          label={driver.status || "PRESENT"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: "6px",
                            backgroundColor: isPresent ? "#dcfce7" : "#fee2e2",
                            color: isPresent ? "#15803d" : "#dc2626",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 6, color: "#64748b" }}
                  >
                    <Typography variant="body2">
                      No matching driver attendance records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Material UI Pagination Bar */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredDrivers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #e2e8f0",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              fontSize: "0.85rem",
              color: "#64748b",
            },
          }}
        />
      </Paper>
    </Box>
  );
}