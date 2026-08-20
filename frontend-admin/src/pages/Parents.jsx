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
} from "@mui/material";

// Direct file path imports to prevent Vite bundling errors
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import GroupsIcon from "@mui/icons-material/Groups";

import { getParents, deleteParent } from "../services/parent.service";
import AddParentModal from "../components/AddParentModal";
import EditParentModal from "../components/EditParentModal";

// Stale-while-revalidate cache — same pattern used across the other
// admin pages. Shows last-known parents instantly on repeat visits
// while a fresh fetch happens quietly in the background, instead of
// blocking the whole page behind a spinner every single time.
const PARENTS_CACHE_KEY = "parentsPageCache";

const Parents = () => {
  const [parents, setParents] = useState(() => {
    try {
      const cached = localStorage.getItem(PARENTS_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Only block the page with a spinner if there's truly nothing cached
  // to show yet (first-ever visit). Otherwise render immediately with
  // stale data and refresh it silently.
  const [loading, setLoading] = useState(() => {
    return localStorage.getItem(PARENTS_CACHE_KEY) === null;
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchParents = async () => {
    try {
      const data = await getParents();
      const nextParents = data.parents || [];
      setParents(nextParents);
      localStorage.setItem(PARENTS_CACHE_KEY, JSON.stringify(nextParents));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete parent?");
    if (!confirmDelete) return;

    try {
      const response = await deleteParent(id);

      setSnackbar({
        open: true,
        message: response.message || "Parent deleted successfully",
        severity: "success",
      });

      fetchParents();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Assigned parent cannot be deleted, unassign first",
        severity: "error",
      });
    }
  };

  const handleEdit = (parent) => {
    setSelectedParent(parent);
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

  // Filter list by name, phone, or student name
  const filteredParents = parents.filter(
    (parent) =>
      parent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.phone?.includes(searchTerm) ||
      parent.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Slice list for current page
  const paginatedParents = filteredParents.slice(
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
        <GroupsIcon sx={{ fontSize: 70, color: "#2563eb" }} />
        <CircularProgress size={50} sx={{ color: "#2563eb" }} />
        <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
          Loading Parents...
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
              Parents
            </Typography>
            <Chip
              label={`${filteredParents.length} Total`}
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
              placeholder="Search parent, phone or student..."
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
              Add Parent
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
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Phone
                </TableCell>
                <TableCell sx={{fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px",}}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Student
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px", pr: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedParents.length > 0 ? (
                paginatedParents.map((parent, index) => (
                  <TableRow
                    key={parent._id || index}
                    sx={{
                      "&:hover": { backgroundColor: "#f8fafc" },
                      transition: "background-color 0.2s ease",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {/* Dynamic Serial Number */}
                    <TableCell sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.875rem" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>
                      {parent.name}
                    </TableCell>

                    <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                      {parent.phone}
                    </TableCell>
                    <TableCell sx={{ color: "#475569", fontWeight: 500, }}>
                      {parent.email || "-"}
                    </TableCell>

                    <TableCell>
                      {parent.studentName ? (
                        <Chip
                          label={parent.studentName}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: "6px",
                            backgroundColor: "#f1f5f9",
                            color: "#334155",
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          -
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(parent)}
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
                          onClick={() => handleDelete(parent._id)}
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
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#64748b" }}>
                    <Typography variant="body2">No matching parent records found.</Typography>
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
          count={filteredParents.length}
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
      <AddParentModal
        open={open}
        handleClose={() => setOpen(false)}
        refreshParents={fetchParents}
      />

      <EditParentModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        parent={selectedParent}
        refreshParents={fetchParents}
      />

      {/* Alert Snackbar */}
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
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Parents;
