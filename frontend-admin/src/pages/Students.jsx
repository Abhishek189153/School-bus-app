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
} from "@mui/material";

// Direct file path imports prevent Vite bundling errors
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SchoolIcon from "@mui/icons-material/School";

import { getStudents, deleteStudent } from "../services/student.service";
import AddStudentModal from "../components/AddStudentModal";
import EditStudentModal from "../components/EditStudentModal";

// Stale-while-revalidate cache — same pattern used across the other
// admin pages. Shows last-known students instantly on repeat visits
// while a fresh fetch happens quietly in the background, instead of
// blocking the whole page behind a spinner every single time.
const STUDENTS_CACHE_KEY = "studentsPageCache";

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
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      await deleteStudent(id);
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

  const filteredStudents = students.filter((student) =>
    (
      (student.admissionNumber || "") +
      " " +
      (student.name || "") +
      " " +
      (student.parentId?.name || "") +
      " " +
      (student.className || "") +
      " " +
      (student.routeId?.routeName || "") +
      " " +
      (student.busId?.busNumber || "") +
      " " +
      (student.pickupStop || "")
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
          {/* Title & Count Badge */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
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
          </Box>

          {/* Search Bar & Action Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search student, class, bus..."
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
                width: { xs: "100%", sm: 320 },
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
          <Table sx={{ minWidth: 700 }}>
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
                  Parent
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Route
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Bus
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Pickup Stop
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

                    <TableCell sx={{ color: "#475569" }}>
                      {student.parentId?.name || "-"}
                    </TableCell>

                    <TableCell sx={{ color: "#475569" }}>
                      {student.routeId?.routeName || "-"}
                    </TableCell>

                    <TableCell>
                      {student.busId?.busNumber ? (
                        <Chip
                          label={student.busId.busNumber}
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

                    <TableCell sx={{ color: "#475569" }}>
                      {student.pickupStop || "-"}
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
                          onClick={() => handleDelete(student._id)}
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
    </Box>
  );
};

export default Students;
