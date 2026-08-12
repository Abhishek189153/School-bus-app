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

// Direct file path imports to prevent Vite bundling/resolution errors
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getBuses } from "../services/bus.service";
import { getDriverAttendanceHistory } from "../services/driverAttendance.service";

// Small reusable debounce hook so we don't hammer the API on every keystroke.
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export default function DriverAttendance() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [busId, setBusId] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

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

  // Loading / error state so slow connections give clear feedback.
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busesLoading, setBusesLoading] = useState(true);
  const [error, setError] = useState("");

  const abortRef = useRef(null);
  const hasLoadedOnce = useRef(false);

  const loadData = useCallback(async () => {
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
      const data = await getDriverAttendanceHistory(date, busId, debouncedSearch, {
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (data && data.success) {
        setDrivers(data.drivers || []);
        setSummary({
          total: data.total || 0,
          present: data.present || 0,
          absent: data.absent || 0,
        });
      } else {
        setDrivers([]);
        setError(data?.message || "Could not load driver attendance.");
      }
    } catch (err) {
      if (err?.name === "AbortError" || controller.signal.aborted) return;
      console.log(err);
      setError(
        "Something went wrong while loading driver attendance. Check your connection and try again."
      );
    } finally {
      if (!controller.signal.aborted) {
        setInitialLoading(false);
        setRefreshing(false);
        hasLoadedOnce.current = true;
      }
    }
  }, [date, busId, debouncedSearch]);

  const loadBuses = useCallback(async () => {
    setBusesLoading(true);
    try {
      const data = await getBuses();
      setBuses(data.buses || []);
    } catch (err) {
      console.log(err);
    } finally {
      setBusesLoading(false);
    }
  }, []);

  // Initial load for buses list
  useEffect(() => {
    loadBuses();
  }, [loadBuses]);

  // Refetch when date, busId, or the debounced search term changes.
  useEffect(() => {
    loadData();
    setPage(0);
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, busId, debouncedSearch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setBusId("");
    setSearch("");
  };

  // Live client-side fallback filter across all fields
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
    if (filteredDrivers.length === 0) return;

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

  const skeletonRows = Array.from({ length: rowsPerPage > 10 ? 10 : rowsPerPage });

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      {/* Summary Metric Cards */}
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

      {/* Filter Toolbar — stacks vertically on mobile */}
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
            disabled={busesLoading}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 150 },
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
              disabled={filteredDrivers.length === 0}
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
            <IconButton size="small" onClick={loadData}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Styled Table Paper Wrapper */}
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
        <Box sx={{ height: 3 }}>
          {refreshing && <LinearProgress sx={{ height: 3 }} />}
        </Box>

        <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Driver
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Phone
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Bus
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Duty On
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Duty Off
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Trips
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#475569", fontSize: "0.78rem", textTransform: "uppercase", pr: 3 }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {initialLoading ? (
                skeletonRows.map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedDrivers.length > 0 ? (
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
                      <TableCell sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.85rem" }}>
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
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "#64748b" }}>
                    <Typography variant="body2">
                      {error ? "Couldn't load records." : "No matching driver attendance records found."}
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
