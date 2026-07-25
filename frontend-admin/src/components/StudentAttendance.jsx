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

// Direct file path imports to prevent Vite bundling errors
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getAttendanceHistory } from "../services/attendance.service";
import { getBuses } from "../services/bus.service";
import { getRoutes } from "../services/route.service";

export default function StudentAttendance() {
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [busId, setBusId] = useState("");
  const [search, setSearch] = useState("");
  const [routeId, setRouteId] = useState("");
  const [tripType, setTripType] = useState("");

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });

  const loadAttendance = async () => {
    try {
      // Pass search term to backend if backend API handles search filters
      const data = await getAttendanceHistory(
        date,
        busId,
        routeId,
        search,
        tripType
      );

      if (data && data.success) {
        setAttendance(data.attendance || []);
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

  const loadFilters = async () => {
    try {
      const busData = await getBuses();
      const routeData = await getRoutes();

      setBuses(busData.buses || []);
      setRoutes(routeData.routes || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial load for buses & routes dropdown options
  useEffect(() => {
    loadFilters();
  }, []);

  // Auto-search / Refetch data whenever search term or filter dropdowns change
  useEffect(() => {
    loadAttendance();
    setPage(0); // Reset pagination to first page on search change
  }, [date, busId, routeId, tripType, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Client-side auto-search fallback across ALL columns
  const filteredAttendance = attendance.filter((item) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase();
    const studentName = (item.studentId?.name || "").toLowerCase();
    const admissionNo = String(item.studentId?.admissionNumber || "").toLowerCase();
    const busNo = (item.busId?.busNumber || "").toLowerCase();
    const routeName = (item.routeId?.routeName || "").toLowerCase();
    const type = (item.tripType || "").toLowerCase();
    const status = (item.status || "").toLowerCase();
    const formattedDate = item.attendanceDate
      ? new Date(item.attendanceDate).toLocaleDateString().toLowerCase()
      : "";

    return (
      studentName.includes(query) ||
      admissionNo.includes(query) ||
      busNo.includes(query) ||
      routeName.includes(query) ||
      type.includes(query) ||
      status.includes(query) ||
      formattedDate.includes(query)
    );
  });

  const exportToExcel = () => {
    const excelData = filteredAttendance.map((item) => ({
      Student: item.studentId?.name || "N/A",
      AdmissionNumber: item.studentId?.admissionNumber || "N/A",
      Bus: item.busId?.busNumber || "N/A",
      Route: item.routeId?.routeName || "N/A",
      TripType: item.tripType || "N/A",
      Status: item.status || "N/A",
      Date: item.attendanceDate
        ? new Date(item.attendanceDate).toLocaleDateString()
        : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      fileData,
      `Attendance_Report_${new Date()
        .toLocaleDateString()
        .replaceAll("/", "-")}.xlsx`
    );
  };

  const paginatedAttendance = filteredAttendance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 0.5 }}>
      {/* Clean & Separated Summary Cards */}
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
              TOTAL ATTENDANCE
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

      {/* Filter Control Toolbar with Auto-Search */}
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

          {/* Bus Dropdown */}
          <TextField
            select
            label="Select Bus"
            size="small"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            sx={{
              minWidth: 140,
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

          {/* Route Dropdown */}
          <TextField
            select
            label="Select Route"
            size="small"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          >
            <MenuItem value="">All Routes</MenuItem>
            {routes.map((route) => (
              <MenuItem key={route._id} value={route._id}>
                {route.routeName}
              </MenuItem>
            ))}
          </TextField>

          {/* Trip Type Dropdown */}
          <TextField
            select
            label="Trip Type"
            size="small"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            sx={{
              minWidth: 130,
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          >
            <MenuItem value="">All Trips</MenuItem>
            <MenuItem value="PICKUP">Pickup</MenuItem>
            <MenuItem value="DROP">Drop</MenuItem>
          </TextField>

          {/* Universal Auto-Search Field */}
          <TextField
            size="small"
            placeholder="Search by student, bus, route, status..."
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

          {/* Excel Export Button */}
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

      {/* Table Section */}
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
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Student
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Admission
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Bus
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Route
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Trip Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase", pr: 3 }}>
                  Date (MM/DD/YYYY)
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedAttendance.length > 0 ? (
                paginatedAttendance.map((item, index) => {
                  const isPresent = item.status === "PRESENT";

                  return (
                    <TableRow
                      key={item._id || index}
                      sx={{
                        "&:hover": { backgroundColor: "#f8fafc" },
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <TableCell sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.85rem" }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>
                        {item.studentId?.name || "-"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={item.studentId?.admissionNumber || "N/A"}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: "6px",
                            backgroundColor: "#f1f5f9",
                            color: "#334155",
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                        {item.busId?.busNumber || "-"}
                      </TableCell>

                      <TableCell sx={{ color: "#475569" }}>
                        {item.routeId?.routeName || "-"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={item.tripType || "PICKUP"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: "6px",
                            backgroundColor: item.tripType === "DROP" ? "#ffedd5" : "#dcfce7",
                            color: item.tripType === "DROP" ? "#c2410c" : "#166534",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={item.status || "PRESENT"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: "6px",
                            backgroundColor: isPresent ? "#dcfce7" : "#fee2e2",
                            color: isPresent ? "#15803d" : "#dc2626",
                          }}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ pr: 3, color: "#64748b", fontWeight: 500 }}>
                        {item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "#64748b" }}>
                    <Typography variant="body2">No matching attendance records found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredAttendance.length}
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