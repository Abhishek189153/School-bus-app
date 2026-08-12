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
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CelebrationIcon from "@mui/icons-material/Celebration";
import AddHolidayModal from "../components/AddHolidayModal";

import {
  getHolidays,
  deleteHoliday,
} from "../services/holiday.service";

// Stale-while-revalidate cache — same pattern used across the other
// admin pages. Shows last-known holidays instantly on repeat visits
// while a fresh fetch happens quietly in the background, instead of
// blocking the whole page behind a spinner every single time.
const HOLIDAYS_CACHE_KEY = "holidaysPageCache";

// Normalize to midnight so "today" comparisons aren't thrown off by
// time-of-day components in stored dates.
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const Holidays = () => {

  const [holidays, setHolidays] = useState(() => {
    try {
      const cached = localStorage.getItem(HOLIDAYS_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Only block the page with a spinner if there's truly nothing cached
  // to show yet (first-ever visit). Otherwise render immediately with
  // stale data and refresh it silently.
  const [loading, setLoading] = useState(() => {
    return localStorage.getItem(HOLIDAYS_CACHE_KEY) === null;
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [timeFilter, setTimeFilter] = useState("all"); // all | upcoming | past

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
      const nextHolidays = data.holidays || [];
      setHolidays(nextHolidays);
      localStorage.setItem(HOLIDAYS_CACHE_KEY, JSON.stringify(nextHolidays));

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

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

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <EventAvailableIcon sx={{ fontSize: 70, color: "#2563eb" }} />
        <CircularProgress size={50} sx={{ color: "#2563eb" }} />
        <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
          Loading Holidays...
        </Typography>
      </Box>
    );
  }

  const today = startOfDay(new Date());

  // Precompute display fields once so status/sorting/search all agree
  // with each other, instead of recalculating "is this past?" in
  // three different places with slightly different logic.
  const withComputedFields = holidays.map((holiday) => {
    const holidayDate = startOfDay(holiday.date);
    const diffDays = Math.round(
      (holidayDate - today) / (1000 * 60 * 60 * 24)
    );

    let status = "upcoming";
    if (diffDays < 0) status = "past";
    else if (diffDays === 0) status = "today";

    const formattedDate = new Date(holiday.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const weekday = new Date(holiday.date).toLocaleDateString("en-IN", {
      weekday: "long",
    });

    return { ...holiday, diffDays, status, formattedDate, weekday };
  });

  // Search matches title, raw date, formatted date, or weekday — the
  // original only matched the raw ISO date string, so searching
  // "Jul" or "Monday" silently returned nothing even though it was
  // visibly on screen.
  const filteredHolidays = withComputedFields.filter((holiday) => {
    const haystack = (
      (holiday.title || "") +
      " " +
      (holiday.date || "") +
      " " +
      holiday.formattedDate +
      " " +
      holiday.weekday
    ).toLowerCase();

    const matchesSearch = haystack.includes(searchTerm.toLowerCase());

    const matchesTime =
      timeFilter === "all" ||
      (timeFilter === "upcoming" && holiday.status !== "past") ||
      (timeFilter === "past" && holiday.status === "past");

    return matchesSearch && matchesTime;
  });

  // Chronological order is the only order that actually makes sense
  // for a holiday calendar — the original list was in raw insertion
  // order, which has no relationship to when holidays actually fall.
  const sortedHolidays = [...filteredHolidays].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const paginatedHolidays = sortedHolidays.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const upcomingCount = withComputedFields.filter(
    (h) => h.status !== "past"
  ).length;
  const pastCount = withComputedFields.length - upcomingCount;

  // The single nearest upcoming (or today's) holiday — surfaced as a
  // banner so an admin sees "what's next" at a glance without having
  // to scan the whole table.
  const nextHoliday = withComputedFields
    .filter((h) => h.status !== "past")
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

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
            mb: 2.5,
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
              label={`${holidays.length} Total`}
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
              placeholder="Search holiday, date, or day..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
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

        {/* Upcoming / Past filter toggle */}
        <ToggleButtonGroup
          value={timeFilter}
          exclusive
          onChange={(_, value) => {
            if (value) {
              setTimeFilter(value);
              setPage(0);
            }
          }}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              borderRadius: "8px !important",
              mr: 1,
              border: "1px solid #cbd5e1 !important",
            },
            "& .Mui-selected": {
              backgroundColor: "#2563eb !important",
              color: "#fff !important",
            },
          }}
        >
          <ToggleButton value="all">All ({holidays.length})</ToggleButton>
          <ToggleButton value="upcoming">Upcoming ({upcomingCount})</ToggleButton>
          <ToggleButton value="past">Past ({pastCount})</ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Next Holiday Banner — the "what's coming up" answer an admin
          actually wants, instead of having to scan the whole table. */}
      {nextHoliday && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: "16px",
            border: "1px solid #bfdbfe",
            backgroundColor: "#eff6ff",
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              p: 1.2,
              borderRadius: "10px",
              backgroundColor: "#dbeafe",
              color: "#1d4ed8",
              display: "flex",
            }}
          >
            <CelebrationIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="caption" sx={{ color: "#1d4ed8", fontWeight: 700 }}>
              {nextHoliday.status === "today" ? "TODAY" : "NEXT HOLIDAY"}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
              {nextHoliday.title} — {nextHoliday.weekday}, {nextHoliday.formattedDate}
            </Typography>
          </Box>
          {nextHoliday.status !== "today" && (
            <Chip
              label={`In ${nextHoliday.diffDays} day${nextHoliday.diffDays === 1 ? "" : "s"}`}
              sx={{
                fontWeight: 700,
                backgroundColor: "#2563eb",
                color: "#fff",
                borderRadius: "8px",
              }}
            />
          )}
        </Paper>
      )}

      {/* Table */}

      <Paper
        elevation={0}
        sx={{
          borderRadius:
            "16px",
          border:
            "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
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
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Status
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
                        // Past holidays are muted — they're historical
                        // record, not something needing attention.
                        opacity: holiday.status === "past" ? 0.6 : 1,
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
                        {holiday.formattedDate}
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "#94a3b8", ml: 1 }}
                        >
                          ({holiday.weekday})
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {holiday.status === "today" && (
                          <Chip
                            label="Today"
                            size="small"
                            sx={{
                              fontWeight: 700,
                              borderRadius: "6px",
                              backgroundColor: "#dcfce7",
                              color: "#166534",
                            }}
                          />
                        )}
                        {holiday.status === "upcoming" && (
                          <Chip
                            label={`In ${holiday.diffDays}d`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              borderRadius: "6px",
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                            }}
                          />
                        )}
                        {holiday.status === "past" && (
                          <Chip
                            label="Past"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              borderRadius: "6px",
                              backgroundColor: "#f1f5f9",
                              color: "#64748b",
                            }}
                          />
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
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 5,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      No holidays match your search or filter.
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
            sortedHolidays.length
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
          sx={{
            borderTop: "1px solid #e2e8f0",
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

    </Box>

  );

};

export default Holidays;
