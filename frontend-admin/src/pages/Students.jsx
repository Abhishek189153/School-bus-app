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
  IconButton,
  Tooltip,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Popover,
} from "@mui/material";

// Direct file path imports prevent Vite bundling errors
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SchoolIcon from "@mui/icons-material/School";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

import { getStudents, deleteStudent } from "../services/student.service";
import AddStudentModal from "../components/AddStudentModal";
import EditStudentModal from "../components/EditStudentModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

// Stale-while-revalidate cache — same pattern used across the other
// admin pages. Shows last-known students instantly on repeat visits
// while a fresh fetch happens quietly in the background, instead of
// blocking the whole page behind a spinner every single time.
const STUDENTS_CACHE_KEY = "studentsPageCache";

// Gender chip color map — kept outside the component so it isn't
// recreated on every render.
const GENDER_STYLES = {
  Male: { backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },
  Female: { backgroundColor: "#fdf2f8", color: "#be185d", border: "1px solid #fbcfe8" },
  Other: { backgroundColor: "#faf5ff", color: "#7e22ce", border: "1px solid #e9d5ff" },
};

const Students = () => {
  const [students, setStudents] = useState(() => {
    try {
      const cached = localStorage.getItem(STUDENTS_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Only block the page with a spinner if there's truly nothing cached
  // to show yet (first-ever visit). Otherwise render immediately with
  // stale data and refresh it silently.
  const [loading, setLoading] = useState(() => {
    return localStorage.getItem(STUDENTS_CACHE_KEY) === null;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [busFilter, setBusFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Delete confirmation dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Transport details popover
  const [transportAnchor, setTransportAnchor] = useState(null);
  const [transportStudent, setTransportStudent] = useState(null);
  const [transportType, setTransportType] = useState(null);

  const handleTransportClick = (event, student, type) => {
    setTransportAnchor(event.currentTarget);
    setTransportStudent(student);
    setTransportType(type);
  };

  const handleTransportClose = () => {
    setTransportAnchor(null);
    setTransportStudent(null);
    setTransportType(null);
  };

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      const nextStudents = data.students || [];
      setStudents(nextStudents);
      localStorage.setItem(STUDENTS_CACHE_KEY, JSON.stringify(nextStudents));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Opens the confirmation dialog instead of deleting immediately.
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteOpen(true);
  };

  // Runs only after the user confirms in the dialog.
  const confirmDeleteStudent = async () => {
    try {
      await deleteStudent(studentToDelete._id);
      setDeleteOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleBusFilterChange = (e) => {
    setBusFilter(e.target.value);
    setPage(0);
  };

  const handleRouteFilterChange = (e) => {
    setRouteFilter(e.target.value);
    setPage(0);
  };

  const handleGenderFilterChange = (e) => {
    setGenderFilter(e.target.value);
    setPage(0);
  };

  // Unique option lists derived from the full student set (not the
  // filtered one) so the dropdown options stay stable as filters change.
  const busOptions = [
    ...new Set(
      students
        .flatMap((s) => [
          s.pickupBusId?.busNumber,
          s.dropBusId?.busNumber,
        ])
        .filter(Boolean)
    ),
  ].sort();

  const routeOptions = [
    ...new Set(
      students
        .flatMap((s) => [
          s.pickupRouteId?.routeName,
          s.dropRouteId?.routeName,
        ])
        .filter(Boolean)
    ),
  ].sort();

  const filteredStudents = students.filter((student) => {
    const searchText = [
      student.admissionNumber,
      student.name,
      student.parentId?.name,
      student.className,
      student.gender,
      student.pickupRouteId?.routeName,
      student.pickupBusId?.busNumber,
      student.pickupStop,
      student.dropRouteId?.routeName,
      student.dropBusId?.busNumber,
      student.dropStop,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchText.includes(searchTerm.toLowerCase());

    const matchesBus =
      busFilter === "all" ||
      student.pickupBusId?.busNumber === busFilter ||
      student.dropBusId?.busNumber === busFilter;

    const matchesRoute =
      routeFilter === "all" ||
      student.pickupRouteId?.routeName === routeFilter ||
      student.dropRouteId?.routeName === routeFilter;

    const matchesGender =
      genderFilter === "all" || student.gender === genderFilter;

    return matchesSearch && matchesBus && matchesRoute && matchesGender;
  });

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setBusFilter("all");
    setRouteFilter("all");
    setGenderFilter("all");
    setPage(0);
  };

  const hasActiveFilters =
    searchTerm !== "" || busFilter !== "all" || routeFilter !== "all" || genderFilter !== "all";

  // Gender counts always reflect the full dataset, not the filtered
  // view — so the badges read as a stable summary, not a shifting one.
  const genderCounts = students.reduce(
    (acc, s) => {
      if (s.gender === "Male") acc.male += 1;
      else if (s.gender === "Female") acc.female += 1;
      else if (s.gender === "Other") acc.other += 1;
      return acc;
    },
    { male: 0, female: 0, other: 0 }
  );

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
        <SchoolIcon sx={{ fontSize: 70, color: "#2563eb" }} />
        <CircularProgress size={50} sx={{ color: "#2563eb" }} />
        <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
          Loading Students...
        </Typography>
      </Box>
    );
  }

  const selectSx = {
    minWidth: 128,
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      fontSize: "0.8125rem",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.8125rem",
    },
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Container */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Title & Count Badges */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a", mr: 0.5 }}>
              Students
            </Typography>
            <Chip
              label={`${filteredStudents.length} Total`}
              size="small"
              sx={{
                fontWeight: 600,
                backgroundColor: "#eff6ff",
                color: "#1d4ed8",
                borderRadius: "8px",
              }}
            />
            <Chip
              label={`Male: ${genderCounts.male}`}
              size="small"
              sx={{
                fontWeight: 600,
                backgroundColor: "#eff6ff",
                color: "#1d4ed8",
                borderRadius: "8px",
              }}
            />
            <Chip
              label={`Female: ${genderCounts.female}`}
              size="small"
              sx={{
                fontWeight: 600,
                backgroundColor: "#fdf2f8",
                color: "#be185d",
                borderRadius: "8px",
              }}
            />
            {genderCounts.other > 0 && (
              <Chip
                label={`Others: ${genderCounts.other}`}
                size="small"
                sx={{
                  fontWeight: 600,
                  backgroundColor: "#faf5ff",
                  color: "#7e22ce",
                  borderRadius: "8px",
                }}
              />
            )}
          </Box>

          {/* Filters, Search Bar & Action Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            {/* Filter Group */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: "4px",
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <FilterListIcon sx={{ color: "#94a3b8", fontSize: 20, ml: 0.75 }} />

              <FormControl size="small" sx={selectSx}>
                <InputLabel>Route</InputLabel>
                <Select
                  value={routeFilter}
                  label="Route"
                  onChange={handleRouteFilterChange}
                >
                  <MenuItem value="all">All Routes</MenuItem>
                  {routeOptions.map((route) => (
                    <MenuItem key={route} value={route}>
                      {route}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={selectSx}>
                <InputLabel>Bus</InputLabel>
                <Select
                  value={busFilter}
                  label="Bus"
                  onChange={handleBusFilterChange}
                >
                  <MenuItem value="all">All Buses</MenuItem>
                  {busOptions.map((bus) => (
                    <MenuItem key={bus} value={bus}>
                      {bus}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={selectSx}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={genderFilter}
                  label="Gender"
                  onChange={handleGenderFilterChange}
                >
                  <MenuItem value="all">All Genders</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Others</MenuItem>
                </Select>
              </FormControl>

              {hasActiveFilters && (
                <Tooltip title="Clear filters">
                  <IconButton
                    onClick={handleClearFilters}
                    size="small"
                    sx={{
                      color: "#94a3b8",
                      "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Divider between filters and search */}
            <Box sx={{ width: "1px", height: 32, backgroundColor: "#e2e8f0" }} />

            <TextField
              placeholder="Search student, class, gender, bus..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: 280 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#cbd5e1" },
                  "&:hover fieldset": { borderColor: "#94a3b8" },
                  "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                },
              }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#2563eb",
                px: 2.5,
                py: 0.9,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              Add Student
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table Container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 950 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Admission No.
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Gender
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Parent
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Pickup Route
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Drop Route
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px", pr: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, index) => (
                  <TableRow
                    key={student._id || index}
                    sx={{
                      "&:hover": { backgroundColor: "#f8fafc" },
                      transition: "background-color 0.2s ease",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <TableCell sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.875rem" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={student.admissionNumber || "N/A"}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: "6px",
                          backgroundColor: "#f1f5f9",
                          color: "#334155",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>
                      {student.name}
                    </TableCell>

                    <TableCell>
                      {student.gender ? (
                        <Chip
                          label={student.gender}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: "7px",
                            ...(GENDER_STYLES[student.gender] || {
                              backgroundColor: "#f1f5f9",
                              color: "#334155",
                            }),
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell sx={{ color: "#475569" }}>
                      {student.parentId?.name || "-"}
                    </TableCell>

                    {/* Pickup Route */}
                    <TableCell>
                      {student.pickupRouteId?.routeName ? (
                        <Chip
                          label={student.pickupRouteId.routeName}
                          size="small"
                          clickable
                          onClick={(event) =>
                            handleTransportClick(event, student, "PICKUP")
                          }
                          sx={{
                            fontWeight: 600,
                            borderRadius: "7px",
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            "&:hover": {
                              backgroundColor: "#dbeafe",
                            },
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Drop Route */}
                    <TableCell>
                      {student.dropRouteId?.routeName ? (
                        <Chip
                          label={student.dropRouteId.routeName}
                          size="small"
                          clickable
                          onClick={(event) =>
                            handleTransportClick(event, student, "DROP")
                          }
                          sx={{
                            fontWeight: 600,
                            borderRadius: "7px",
                            backgroundColor: "#f0fdf4",
                            color: "#15803d",
                            border: "1px solid #bbf7d0",
                            "&:hover": {
                              backgroundColor: "#dcfce7",
                            },
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(student)}
                          sx={{
                            color: "#2563eb",
                            mr: 1,
                            "&:hover": { backgroundColor: "#eff6ff" },
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(student)}
                          sx={{
                            color: "#ef4444",
                            "&:hover": { backgroundColor: "#fef2f2" },
                          }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "#64748b" }}>
                    <Typography variant="body2">No matching student records found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Bar */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #e2e8f0",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              fontSize: "0.875rem",
              color: "#64748b",
            },
          }}
        />
      </Paper>

      {/* Transport Details Popover */}
      <Popover
        open={Boolean(transportAnchor)}
        anchorEl={transportAnchor}
        onClose={handleTransportClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              p: 2,
              width: 280,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
            },
          },
        }}
      >
        {transportStudent && transportType && (
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: transportType === "PICKUP" ? "#1d4ed8" : "#15803d",
                mb: 1.5,
              }}
            >
              {transportType === "PICKUP"
                ? "🚌 Pickup Transport"
                : "🏠 Drop Transport"}
            </Typography>

            <Box sx={{ display: "grid", gap: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                  Route
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
                  {transportType === "PICKUP"
                    ? transportStudent.pickupRouteId?.routeName || "-"
                    : transportStudent.dropRouteId?.routeName || "-"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                  Bus
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
                  {transportType === "PICKUP"
                    ? transportStudent.pickupBusId?.busNumber || "-"
                    : transportStudent.dropBusId?.busNumber || "-"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                  {transportType === "PICKUP" ? "Pickup Stop" : "Drop Stop"}
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
                  {transportType === "PICKUP"
                    ? transportStudent.pickupStop || "-"
                    : transportStudent.dropStop || "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Popover>

      {/* Modals */}
      <AddStudentModal
        open={open}
        handleClose={() => setOpen(false)}
        refreshStudents={fetchStudents}
      />

      <EditStudentModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        student={selectedStudent}
        refreshStudents={fetchStudents}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDeleteStudent}
        entityLabel="student"
        itemName={studentToDelete?.name}
      />
    </Box>
  );
};

export default Students;
