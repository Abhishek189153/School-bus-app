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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Direct file path imports to prevent Vite bundling/resolution errors
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { getBuses, deleteBus } from "../services/bus.service";
import AddBusModal from "../components/AddBusModal";
import EditBusModal from "../components/EditBusModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

// Stale-while-revalidate cache — same pattern used across the other
// admin pages. Shows last-known buses instantly on repeat visits
// while a fresh fetch happens quietly in the background, instead of
// blocking the whole page behind a spinner every single time.
const BUSES_CACHE_KEY = "busesPageCache";

const Buses = () => {
  const [buses, setBuses] = useState(() => {
    try {
      const cached = localStorage.getItem(BUSES_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Only block the page with a spinner if there's truly nothing cached
  // to show yet (first-ever visit). Otherwise render immediately with
  // stale data and refresh it silently.
  const [loading, setLoading] = useState(() => {
    return localStorage.getItem(BUSES_CACHE_KEY) === null;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  // Delete confirmation dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);

  // Warning when bus still has driver or route assigned
const [assignmentWarningOpen, setAssignmentWarningOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchBuses = async () => {
    try {
      const data = await getBuses();
      const nextBuses = data.buses || [];
      setBuses(nextBuses);
      localStorage.setItem(BUSES_CACHE_KEY, JSON.stringify(nextBuses));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Opens the appropriate dialog depending on bus assignments.
const handleDeleteClick = (bus) => {
  const hasDriver = Boolean(bus.driverId);
  const hasRoute = Boolean(bus.routeId);

  // Bus cannot be deleted if either driver or route is assigned.
  if (hasDriver || hasRoute) {
    setAssignmentWarningOpen(true);
    return;
  }

  // Only buses with no driver and no route
  // open the normal delete confirmation.
  setBusToDelete(bus);
  setDeleteOpen(true);
};

  // Runs only after the user confirms in the dialog.
  const confirmDeleteBus = async () => {
    try {
      await deleteBus(busToDelete._id);
      setDeleteOpen(false);
      setBusToDelete(null);
      fetchBuses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (bus) => {
    setSelectedBus(bus);
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

  // Filter list by Bus Number or Vehicle Number
  const filteredBuses = buses.filter((bus) =>
    ((bus.busNumber || "") + " " + (bus.vehicleNumber || ""))
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Slice list for current page
  const paginatedBuses = filteredBuses.slice(
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
        <DirectionsBusIcon sx={{ fontSize: 70, color: "#2563eb" }} />
        <CircularProgress size={50} sx={{ color: "#2563eb" }} />
        <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
          Loading Buses...
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
              Buses
            </Typography>
            <Chip
              label={`${filteredBuses.length} Total`}
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
              placeholder="Search bus or vehicle number..."
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
              Add Bus
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
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Bus Number
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Vehicle Number
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px", pr: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedBuses.length > 0 ? (
                paginatedBuses.map((bus, index) => (
                  <TableRow
                    key={bus._id || index}
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

                    <TableCell>
                      <Chip
                        label={bus.busNumber || "N/A"}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: "6px",
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>
                      {bus.vehicleNumber || "-"}
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(bus)}
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
                          onClick={() => handleDeleteClick(bus)}
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
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: "#64748b" }}>
                    <Typography variant="body2">No matching bus records found.</Typography>
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
          count={filteredBuses.length}
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
      <AddBusModal
        open={open}
        handleClose={() => setOpen(false)}
        refreshBuses={fetchBuses}
      />

      <EditBusModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        bus={selectedBus}
        refreshBuses={fetchBuses}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDeleteBus}
        entityLabel="bus"
        itemName={busToDelete?.busNumber}
      />

      <Dialog
  open={assignmentWarningOpen}
  onClose={() => setAssignmentWarningOpen(false)}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "18px",
      overflow: "hidden",
    },
  }}
>
  <DialogTitle
    sx={{
      px: 3,
      pt: 3,
      pb: 1,
      textAlign: "center",
      fontWeight: 800,
      fontSize: 18,
      color: "#0f172a",
    }}
  >
    Cannot Delete Bus
  </DialogTitle>

  <DialogContent
    sx={{
      px: 3,
      pb: 1,
    }}
  >
    <Typography
      sx={{
        textAlign: "center",
        fontSize: 14,
        color: "#475569",
        lineHeight: 1.6,
      }}
    >
      Unassign driver and routes before deleting bus.
    </Typography>
  </DialogContent>

  <DialogActions
    sx={{
      px: 3,
      py: 2.5,
    }}
  >
    <Button
      fullWidth
      variant="contained"
      onClick={() => setAssignmentWarningOpen(false)}
      sx={{
        fontWeight: 700,
        textTransform: "none",
        borderRadius: "10px",
        py: 1,
      }}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default Buses;
