import React, { useEffect, useRef, useState, useCallback } from "react";
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
  LinearProgress,
  Skeleton,
  Alert,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Direct file path imports to prevent Vite bundling errors
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getAttendanceHistory } from "../services/attendance.service";
import { getBuses } from "../services/bus.service";
import { getRoutes } from "../services/route.service";

// Gender chip color map — same palette used on the Students page so
// gender reads consistently across the app.
const GENDER_STYLES = {
  Male: { backgroundColor: "#eff6ff", color: "#1d4ed8" },
  Female: { backgroundColor: "#fdf2f8", color: "#be185d" },
  Other: { backgroundColor: "#faf5ff", color: "#7e22ce" },
};

// Small reusable debounce hook so we don't hammer the API on every keystroke.
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export default function StudentAttendance() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [busId, setBusId] = useState("");
  const [search, setSearch] = useState("");
  const [routeId, setRouteId] = useState("");
  const [tripType, setTripType] = useState("");
  const [gender, setGender] = useState("");

  // Debounce only the free-text search so dropdown/date changes stay instant
  // while typing doesn't fire a request on every character.
  const debouncedSearch = useDebouncedValue(search, 400);

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

  // Loading / error state so slow connections show clear feedback instead of
  // a blank or stale table.
  const [initialLoading, setInitialLoading] = useState(true); // first ever load -> skeleton rows
  const [refreshing, setRefreshing] = useState(false); // subsequent loads -> thin top bar
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep a ref to the in-flight request's AbortController so that if the
  // user changes filters again before the previous call finishes, we cancel
  // the stale one instead of letting it race and overwrite fresher data.
  const abortRef = useRef(null);
  const hasLoadedOnce = useRef(false);

  const loadAttendance = useCallback(async () => {
    // Cancel any in-flight request before starting a new one.
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setError("");
    if (!hasLoadedOnce.current) {
      setInitialLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const data = await getAttendanceHistory(
        date,
        busId,
        routeId,
        debouncedSearch,
        tripType,
        { signal: controller.signal }
      );

      if (controller.signal.aborted) return;

      if (data && data.success) {
        setAttendance(data.attendance || []);
        setSummary({
          total: data.total || 0,
          present: data.present || 0,
          absent: data.absent || 0,
        });
      } else {
        setAttendance([]);
        setError(data?.message || "Could not load attendance records.");
      }
    } catch (err) {
      if (err?.name === "AbortError" || controller.signal.aborted) return;
      console.log(err);
      setError(
        "Something went wrong while loading attendance. Check your connection and try again."
      );
    } finally {
      if (!controller.signal.aborted) {
        setInitialLoading(false);
        setRefreshing(false);
        hasLoadedOnce.current = true;
      }
    }
  }, [date, busId, routeId, debouncedSearch, tripType]);

  const loadFilters = useCallback(async () => {
    setFiltersLoading(true);
    try {
      const [busData, routeData] = await Promise.all([getBuses(), getRoutes()]);
      setBuses(busData.buses || []);
      setRoutes(routeData.routes || []);
    } catch (err) {
      console.log(err);
    } finally {
      setFiltersLoading(false);
    }
  }, []);

  // Initial load for buses & routes dropdown options
  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  // Refetch whenever filters or the debounced search term change.
  // Gender is deliberately excluded here — it's filtered client-side below
  // (same as the free-text search fallback), since it lives on the student
  // record, not the attendance record the backend query is built around.
  useEffect(() => {
    loadAttendance();
    setPage(0); // Reset pagination to first page on filter/search change
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, busId, routeId, tripType, debouncedSearch]);

  // Reset pagination when the gender filter changes too, same as the other filters.
  useEffect(() => {
    setPage(0);
  }, [gender]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setBusId("");
    setRouteId("");
    setTripType("");
    setGender("");
    setSearch("");
  };

  // Client-side fallback filter across all visible columns — covers the
  // gap between "search term typed" and "debounced value sent to backend",
  // and also applies the gender filter (backend query isn't gender-aware).
  const filteredAttendance = attendance.filter((item) => {
    const matchesGender = !gender || item.studentId?.gender === gender;
    if (!matchesGender) return false;

    if (!search.trim()) return true;

    const query = search.toLowerCase();
    const studentName = (item.studentId?.name || "").toLowerCase();
    const admissionNo = String(item.studentId?.admissionNumber || "").toLowerCase();
    const studentGender = (item.studentId?.gender || "").toLowerCase();
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
      studentGender.includes(query) ||
      busNo.includes(query) ||
      routeName.includes(query) ||
      type.includes(query) ||
      status.includes(query) ||
      formattedDate.includes(query)
    );
  });

  const exportToExcel = () => {
    if (filteredAttendance.length === 0) return;

    const excelData = filteredAttendance.map((item) => ({
      Student: item.studentId?.name || "N/A",
      AdmissionNumber: item.studentId?.admissionNumber || "N/A",
      Gender: item.studentId?.gender || "N/A",
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

  const isBusy = initialLoading || refreshing;
  const skeletonRows = Array.from({ length: rowsPerPage > 10 ? 10 : rowsPerPage });

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      {/* Summary Cards */}
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
            {initialLoading ? (
              <Skeleton variant="text" width={60} height={36} />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {summary.total}
              </Typography>
            )}
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
            {initialLoading ? (
              <Skeleton variant="text" width={60} height={36} />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#15803d" }}>
                {summary.present}
              </Typography>
            )}
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
            {initialLoading ? (
              <Skeleton variant="text" width={60} height={36} />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#dc2626" }}>
                {summary.absent}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Filter Toolbar — stacks vertically on mobile, wraps on tablet/desktop */}
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          flexWrap="wrap"
          gap={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
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

          <TextField
            select
            label="Select Bus"
            size="small"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            disabled={filtersLoading}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 140 },
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

          <TextField
            select
            label="Select Route"
            size="small"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            disabled={filtersLoading}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 150 },
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

          <TextField
            select
            label="Trip Type"
            size="small"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 130 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          >
            <MenuItem value="">All Trips</MenuItem>
            <MenuItem value="PICKUP">Pickup</MenuItem>
            <MenuItem value="DROP">Drop</MenuItem>
          </TextField>

          <TextField
            select
            label="Gender"
            size="small"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 130 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          >
            <MenuItem value="">All Genders</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Others</MenuItem>
          </TextField>

          <TextField
            size="small"
            placeholder="Search by student, gender, bus, route, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              flexGrow: 1,
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 240 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          />

          <Stack direction="row" gap={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              fullWidth={isMobile}
              startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
              onClick={exportToExcel}
              disabled={filteredAttendance.length === 0}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#16a34a",
                px: 2,
                py: 0.8,
                boxShadow: "none",
                flexShrink: 0,
                "&:hover": { backgroundColor: "#15803d" },
              }}
            >
              Export Excel
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: "10px" }}
          action={
            <IconButton size="small" onClick={loadAttendance}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Table Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Thin progress bar for background refetches so the table doesn't flash/blank out */}
        <Box sx={{ height: 3 }}>
          {refreshing && <LinearProgress sx={{ height: 3 }} />}
        </Box>

        <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table sx={{ minWidth: 820 }}>
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
                  Gender
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
              {initialLoading ? (
                skeletonRows.map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedAttendance.length > 0 ? (
                paginatedAttendance.map((item, index) => {
                  const isPresent = item.status === "PRESENT";
                  const studentGender = item.studentId?.gender;

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

                     <TableCell>
  <Typography
    sx={{
      fontSize: "0.85rem",
      fontWeight: 600,
      color:
        item.studentId?.gender === "Female"
          ? "#db2777"
          : item.studentId?.gender === "Male"
          ? "#7c3aed"
          : "#111827",
    }}
  >
    {item.studentId?.gender || "-"}
  </Typography>
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
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: "#64748b" }}>
                    <Typography variant="body2">
                      {error ? "Couldn't load records." : "No matching attendance records found."}
                    </Typography>
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
            ".MuiTablePagination-toolbar": {
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
            },
          }}
        />
      </Paper>
    </Box>
  );
}
