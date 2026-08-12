import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
  Paper,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

// Direct file path imports to prevent Vite bundling/resolution errors
import DirectionsBusOutlinedIcon from "@mui/icons-material/DirectionsBusOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import SearchIcon from "@mui/icons-material/Search";

import { getBusOverview } from "../services/busOverview.service";
import {
  unassignDriverFromBus,
  unassignRouteFromBus,
} from "../services/assignment.service";

// Stale-while-revalidate cache — same pattern used across the other
// admin pages. Shows last-known fleet data instantly on repeat visits
// while a fresh fetch happens quietly in the background, instead of
// blocking the whole page behind a spinner every single time.
const BUS_OVERVIEW_CACHE_KEY = "busOverviewPageCache";

const BusOverview = () => {
  const [buses, setBuses] = useState(() => {
    try {
      const cached = localStorage.getItem(BUS_OVERVIEW_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Only block the page with a spinner if there's truly nothing cached
  // to show yet (first-ever visit). Otherwise render immediately with
  // stale data and refresh it silently.
  const [loading, setLoading] = useState(() => {
    return localStorage.getItem(BUS_OVERVIEW_CACHE_KEY) === null;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchBusOverview = async () => {
    try {
      const data = await getBusOverview();
      const nextBuses = data.buses || [];
      setBuses(nextBuses);
      localStorage.setItem(BUS_OVERVIEW_CACHE_KEY, JSON.stringify(nextBuses));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusOverview();
  }, []);

  const handleUnassignDriver = async (busId) => {
    const confirmAction = window.confirm("Unassign driver from this bus?");
    if (!confirmAction) return;

    try {
      await unassignDriverFromBus(busId);
      fetchBusOverview();
      setSnackbar({
        open: true,
        message: "Driver unassigned successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to unassign driver",
        severity: "error",
      });
    }
  };

  const handleUnassignRoute = async (busId, routeId) => {
    const confirmAction = window.confirm("Unassign route from this bus?");
    if (!confirmAction) return;

    try {
      await unassignRouteFromBus(busId, routeId);
      fetchBusOverview();
      setSnackbar({
        open: true,
        message: "Route unassigned successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to unassign route",
        severity: "error",
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
        <DirectionsBusOutlinedIcon sx={{ fontSize: 70, color: "#2563eb" }} />
        <CircularProgress size={50} sx={{ color: "#2563eb" }} />
        <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
          Loading Fleet Overview...
        </Typography>
      </Box>
    );
  }

  // Helper: derive per-bus computed fields once, reused for stats,
  // filtering, and sorting so the "active" definition can't drift
  // between different parts of the page.
  const withComputedFields = buses.map((bus) => {
    const totalStudents =
      bus.routeStudentCounts?.reduce((sum, route) => sum + route.count, 0) || 0;

    const routeCount =
      (bus.routeId ? 1 : 0) + (bus.additionalRoutes?.length || 0);

    const isActive =
      Boolean(bus.driverId) && routeCount > 0 && totalStudents > 0;

    return { ...bus, totalStudents, routeCount, isActive };
  });

  // Aggregate Fleet Metrics
  const totalBuses = withComputedFields.length;
  const activeBusesCount = withComputedFields.filter((b) => b.isActive).length;
  const totalFleetStudents = withComputedFields.reduce(
    (sum, b) => sum + b.totalStudents,
    0
  );
  const utilizationPct =
    totalBuses > 0 ? Math.round((activeBusesCount / totalBuses) * 100) : 0;
  const unassignedDriverCount = withComputedFields.filter(
    (b) => !b.driverId
  ).length;

  // Search + status filter
  const filteredBuses = withComputedFields.filter((bus) => {
    const matchesSearch =
      (
        (bus.busNumber || "") +
        " " +
        (bus.vehicleNumber || "") +
        " " +
        (bus.driverId?.name || "")
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && bus.isActive) ||
      (statusFilter === "inactive" && !bus.isActive);

    return matchesSearch && matchesStatus;
  });

  // Realistic default ordering: attention-needed buses (inactive) surface
  // first so an admin scanning the fleet sees problems immediately,
  // rather than hunting through a flat, unordered list.
  const sortedBuses = [...filteredBuses].sort((a, b) => {
    if (a.isActive === b.isActive) {
      return (a.busNumber || "").localeCompare(b.busNumber || "");
    }
    return a.isActive ? 1 : -1;
  });

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header & Fleet Stats Summary */}
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
            mb: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Bus Overview
            </Typography>
            <Chip
              label="Fleet Live Monitoring"
              size="small"
              sx={{
                fontWeight: 600,
                backgroundColor: "#eff6ff",
                color: "#1d4ed8",
                borderRadius: "8px",
              }}
            />
          </Box>

          {/* Metric Badges */}
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Chip
              icon={<DirectionsBusOutlinedIcon fontSize="small" />}
              label={`Total Buses: ${totalBuses}`}
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: "8px", borderColor: "#cbd5e1" }}
            />
            <Chip
              label={`Active Fleet: ${activeBusesCount} (${utilizationPct}%)`}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: "#dcfce7",
                color: "#166534",
              }}
            />
            <Chip
              icon={<GroupsOutlinedIcon fontSize="small" />}
              label={`Students Onboard: ${totalFleetStudents}`}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: "#fef3c7",
                color: "#92400e",
              }}
            />
            {unassignedDriverCount > 0 && (
              <Tooltip title="Buses with no driver assigned — these can't run">
                <Chip
                  label={`Needs Driver: ${unassignedDriverCount}`}
                  sx={{
                    fontWeight: 600,
                    borderRadius: "8px",
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Search + Status Filter */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            placeholder="Search bus, vehicle no., or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(_, value) => value && setStatusFilter(value)}
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
            <ToggleButton value="all">All ({totalBuses})</ToggleButton>
            <ToggleButton value="active">Active ({activeBusesCount})</ToggleButton>
            <ToggleButton value="inactive">
              Inactive ({totalBuses - activeBusesCount})
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Grid of Bus Overview Cards — CSS Grid via Box instead of MUI
          <Grid item>, whose old xs/md/lg prop API doesn't reliably
          size columns on newer MUI versions (this was letting 5 cards
          cram into one row instead of respecting lg={4}'s 3-per-row
          intent). auto-fill/minmax also means it adapts smoothly to
          ANY desktop width, not just the specific breakpoints we
          guess at. */}
      {sortedBuses.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 3,
          }}
        >
          {sortedBuses.map((bus) => {
            const { totalStudents, isActive } = bus;

            return (
              <Card
                key={bus._id}
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: `2px solid ${isActive ? "#16a34a" : "#ef4444"}`,
                  backgroundColor: isActive ? "#f0fdf4" : "#fef2f2",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Bus Header Bar */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsBusOutlinedIcon
                        sx={{ color: isActive ? "#15803d" : "#dc2626" }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#0f172a" }}
                      >
                        {bus.busNumber}
                      </Typography>
                    </Box>

                    <Chip
                      label={isActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        borderRadius: "6px",
                        backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
                        color: isActive ? "#166534" : "#991b1b",
                        border: `1px solid ${isActive ? "#bbf7d0" : "#fecaca"}`,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", fontWeight: 500, mb: 2 }}
                  >
                    Vehicle No:{" "}
                    <Box
                      component="span"
                      sx={{ color: "#0f172a", fontWeight: 600 }}
                    >
                      {bus.vehicleNumber || "N/A"}
                    </Box>
                  </Typography>

                  <Divider sx={{ my: 1.5, borderColor: isActive ? "#dcfce7" : "#fee2e2" }} />

                  {/* Driver Section Card */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      mb: 1.5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonOutlineOutlinedIcon
                        fontSize="small"
                        sx={{ color: "#64748b" }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#94a3b8", display: "block" }}
                        >
                          Driver
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#0f172a" }}
                        >
                          {bus.driverId?.name || "Not Assigned"}
                        </Typography>
                        {bus.driverId?.phone && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8" }}
                          >
                            {bus.driverId.phone}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {bus.driverId && (
                      <Tooltip title="Unassign Driver">
                        <Button
                          size="small"
                          color="error"
                          startIcon={<LinkOffIcon fontSize="small" />}
                          onClick={() => handleUnassignDriver(bus._id)}
                          sx={{ textTransform: "none", fontSize: "0.75rem" }}
                        >
                          Unassign
                        </Button>
                      </Tooltip>
                    )}
                  </Box>

                  {/* Routes Section Card */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AltRouteOutlinedIcon
                          fontSize="small"
                          sx={{ color: "#64748b" }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "#94a3b8", fontWeight: 600 }}
                        >
                          ASSIGNED ROUTES
                        </Typography>
                      </Box>

                      {totalStudents > 0 && (
                        <Typography
                          variant="caption"
                          sx={{ color: "#2563eb", fontWeight: 700 }}
                        >
                          {totalStudents} total
                        </Typography>
                      )}
                    </Box>

                    {!bus.routeId &&
                      (!bus.additionalRoutes ||
                        bus.additionalRoutes.length === 0) && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#94a3b8", fontStyle: "italic" }}
                        >
                          No routes assigned
                        </Typography>
                      )}

                    {/* Primary Route */}
                    {bus.routeId && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 0.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#0f172a" }}
                          >
                            {bus.routeId.routeName}
                          </Typography>
                          <Chip
                            label={`${
                              bus.routeStudentCounts?.find(
                                (r) => r.routeId === bus.routeId._id
                              )?.count || 0
                            } Students`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                            }}
                          />
                        </Box>

                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            handleUnassignRoute(bus._id, bus.routeId._id)
                          }
                          sx={{
                            minWidth: "auto",
                            p: "2px 6px",
                            fontSize: "0.75rem",
                            textTransform: "none",
                          }}
                        >
                          Unassign
                        </Button>
                      </Box>
                    )}

                    {/* Additional Routes */}
                    {bus.additionalRoutes?.map((item) => (
                      <Box
                        key={item._id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 0.5,
                          borderTop: "1px dashed #e2e8f0",
                          mt: 0.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#0f172a" }}
                          >
                            {item.routeId?.routeName}
                          </Typography>
                          <Chip
                            label={`${
                              bus.routeStudentCounts?.find(
                                (r) => r.routeId === item.routeId?._id
                              )?.count || 0
                            } Students`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                            }}
                          />
                        </Box>

                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            handleUnassignRoute(bus._id, item.routeId?._id)
                          }
                          sx={{
                            minWidth: "auto",
                            p: "2px 6px",
                            fontSize: "0.75rem",
                            textTransform: "none",
                          }}
                        >
                          Unassign
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            color: "#94a3b8",
          }}
        >
          <Typography variant="body2">
            No buses match your search or filter.
          </Typography>
        </Paper>
      )}

      {/* Snackbar Alert Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BusOverview;
