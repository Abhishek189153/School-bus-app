import React, { useEffect, useState } from "react";
import {
  Grid,
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
} from "@mui/material";

// Direct file path imports to prevent Vite bundling/resolution errors
import DirectionsBusOutlinedIcon from "@mui/icons-material/DirectionsBusOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LinkOffIcon from "@mui/icons-material/LinkOff";

import { getBusOverview } from "../services/busOverview.service";
import {
  unassignDriverFromBus,
  unassignRouteFromBus,
} from "../services/assignment.service";

const BusOverview = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchBusOverview = async () => {
    try {
      const data = await getBusOverview();
      setBuses(data.buses || []);
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress size={40} sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  // Aggregate Fleet Metrics
  const totalBuses = buses.length;
  let activeBusesCount = 0;
  let totalFleetStudents = 0;

  buses.forEach((bus) => {
    const totalStudents =
      bus.routeStudentCounts?.reduce((sum, route) => sum + route.count, 0) || 0;
    totalFleetStudents += totalStudents;

    const isActive =
      bus.driverId &&
      (bus.routeId || bus.additionalRoutes?.length > 0) &&
      totalStudents > 0;

    if (isActive) activeBusesCount++;
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
              label={`Active Fleet: ${activeBusesCount}`}
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
          </Box>
        </Box>
      </Paper>

      {/* Grid of Bus Overview Cards */}
      <Grid container spacing={3}>
        {buses.map((bus) => {
          const totalStudents =
            bus.routeStudentCounts?.reduce(
              (sum, route) => sum + route.count,
              0
            ) || 0;

          const isActive =
            bus.driverId &&
            (bus.routeId || bus.additionalRoutes?.length > 0) &&
            totalStudents > 0;

          return (
            <Grid item xs={12} md={6} lg={4} key={bus._id}>
              <Card
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
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
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

                    {!bus.routeId &&
                      (!bus.additionalRoutes ||
                        bus.additionalRoutes.length === 0) && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#94a3b8", italic: true }}
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
            </Grid>
          );
        })}
      </Grid>

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