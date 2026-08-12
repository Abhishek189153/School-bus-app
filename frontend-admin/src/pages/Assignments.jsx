import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Snackbar,
  Alert,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  CircularProgress,
} from "@mui/material";

// Direct file path imports to prevent Vite bundling/resolution errors
import DirectionsBusOutlinedIcon from "@mui/icons-material/DirectionsBusOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/announcement.service";

import { getDrivers } from "../services/driver.service";
import { getBuses } from "../services/bus.service";
import { getRoutes } from "../services/route.service";

import {
  assignDriverToBus,
  assignRouteToBus,
} from "../services/assignment.service";

// Cache key for stale-while-revalidate pattern — same approach used on
// the Dashboard. Shows last-known data instantly on repeat visits while
// a fresh fetch happens quietly in the background.
const ASSIGNMENTS_CACHE_KEY = "assignmentsPageCache";

const Assignments = () => {
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [driverBus, setDriverBus] = useState("");
  const [driverId, setDriverId] = useState("");

  const [routeBus, setRouteBus] = useState("");
  const [routeId, setRouteId] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Only block the page with a spinner if there's truly nothing cached
  // to show yet (first-ever visit). Otherwise render immediately with
  // stale data and refresh it silently.
  const [loading, setLoading] = useState(() => {
    return localStorage.getItem(ASSIGNMENTS_CACHE_KEY) === null;
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadData = async () => {
    try {
      const [driversData, busesData, routesData, announcementData] =
        await Promise.all([
          getDrivers(),
          getBuses(),
          getRoutes(),
          getAnnouncements(),
        ]);

      const nextDrivers = driversData.drivers || [];
      const nextBuses = busesData.buses || [];
      const nextRoutes = routesData.routes || [];
      const nextAnnouncements = announcementData.data?.announcements || [];

      setDrivers(nextDrivers);
      setBuses(nextBuses);
      setRoutes(nextRoutes);
      setAnnouncements(nextAnnouncements);

      localStorage.setItem(
        ASSIGNMENTS_CACHE_KEY,
        JSON.stringify({
          drivers: nextDrivers,
          buses: nextBuses,
          routes: nextRoutes,
          announcements: nextAnnouncements,
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Hydrate instantly from cache (if any) before the network request
  // resolves, so returning visitors see content immediately.
  useEffect(() => {
    try {
      const cached = localStorage.getItem(ASSIGNMENTS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setDrivers(parsed.drivers || []);
        setBuses(parsed.buses || []);
        setRoutes(parsed.routes || []);
        setAnnouncements(parsed.announcements || []);
      }
    } catch {
      // ignore malformed cache
    }

    loadData();
  }, []);

  const handleAssignDriver = async () => {
    if (!driverBus || !driverId) {
      setSnackbar({
        open: true,
        message: "Please select both a bus and a driver.",
        severity: "error",
      });
      return;
    }

    try {
      await assignDriverToBus({
        busId: driverBus,
        driverId,
      });

      setSnackbar({
        open: true,
        message: "Driver assigned successfully",
        severity: "success",
      });
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Something went wrong",
        severity: "error",
      });
    }
  };

  const handleAssignRoute = async () => {

  if (!routeBus || !routeId) {
    setSnackbar({
      open: true,
      message: "Please select both a bus and a route.",
      severity: "error",
    });
    return;
  }

  // FRONTEND CHECK
  // const routeAlreadyAssigned = buses.some(
  //   (bus) =>
  //     bus.routeId?.toString() === routeId.toString()
  // );

  // if (routeAlreadyAssigned) {
  //   setSnackbar({
  //     open: true,
  //     message:
  //       "Route is already assigned to another bus.",
  //     severity: "error",
  //   });

  //   return;
  // }

  try {
    await assignRouteToBus({
      busId: routeBus,
      routeId,
    });

    setSnackbar({
      open: true,
      message: "Route assigned successfully",
      severity: "success",
    });

    loadData();

  } catch (error) {
    setSnackbar({
      open: true,
      message:
        error.response?.data?.message ||
        "Something went wrong",
      severity: "error",
    });
  }
};

  const handleAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      setSnackbar({
        open: true,
        message: "Title and Message are required.",
        severity: "error",
      });
      return;
    }

    try {
      if (editingId) {
        await updateAnnouncement(editingId, { title, message });
        setSnackbar({
          open: true,
          message: "Announcement updated",
          severity: "success",
        });
      } else {
        await createAnnouncement({ title, message });
        setSnackbar({
          open: true,
          message: "Announcement created",
          severity: "success",
        });
      }

      setTitle("");
      setMessage("");
      setEditingId(null);
      loadData();
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Failed to publish announcement",
        severity: "error",
      });
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    const confirmDelete = window.confirm("Delete this announcement?");
    if (!confirmDelete) return;

    try {
      await deleteAnnouncement(id);
      setSnackbar({
        open: true,
        message: "Announcement deleted",
        severity: "success",
      });
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setMessage("");
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
        <CampaignOutlinedIcon sx={{ fontSize: 70, color: "#9333ea" }} />
        <CircularProgress size={50} sx={{ color: "#9333ea" }} />
        <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
          Loading Assignments...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Page Header */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Bus Assignments & Broadcasts
          </Typography>
          <Chip
            label="System Admin"
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: "#eff6ff",
              color: "#1d4ed8",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Paper>

      {/* Top Section: Equal 2-Column Grid for Driver & Route Assignment.
          Using CSS Grid via Box instead of MUI <Grid> — the old
          item/xs/md prop API doesn't reliably produce column widths
          on newer MUI versions, which was causing these cards to
          collapse to content-width and leave a large empty gap. */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Driver Assignment Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: "10px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                }}
              >
                <PersonOutlineOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Assign Driver to Bus
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Map an active driver to a specific bus vehicle.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Autocomplete
                options={buses}
                getOptionLabel={(option) =>
                  `${option.busNumber} - ${option.vehicleNumber || "No Vehicle"}`
                }
                onChange={(_, value) => setDriverBus(value?._id || "")}
                renderInput={(params) => (
                  <TextField {...params} label="Select Target Bus" size="small" />
                )}
              />

              <Autocomplete
                options={drivers}
                getOptionLabel={(option) => `${option.name} (${option.phone})`}
                onChange={(_, value) => setDriverId(value?._id || "")}
                renderInput={(params) => (
                  <TextField {...params} label="Select Active Driver" size="small" />
                )}
              />
            </Box>
          </Box>

          <Button
            fullWidth
            sx={{
              mt: 4,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#2563eb",
              py: 1.2,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
            variant="contained"
            startIcon={<DirectionsBusOutlinedIcon />}
            onClick={handleAssignDriver}
          >
            Assign Driver
          </Button>
        </Paper>

        {/* Route Assignment Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: "10px",
                  backgroundColor: "#f0fdf4",
                  color: "#16a34a",
                  display: "flex",
                }}
              >
                <AltRouteOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Assign Route to Bus
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Attach a pickup/drop-off route schedule to a bus.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Autocomplete
                options={buses}
                getOptionLabel={(option) =>
                  `${option.busNumber} - ${option.vehicleNumber || "No Vehicle"}`
                }
                onChange={(_, value) => setRouteBus(value?._id || "")}
                renderInput={(params) => (
                  <TextField {...params} label="Select Target Bus" size="small" />
                )}
              />

              <Autocomplete
                options={routes}
                getOptionLabel={(option) =>
                  `${option.routeName} (${option.tripType || "Route"})`
                }
                onChange={(_, value) => setRouteId(value?._id || "")}
                renderInput={(params) => (
                  <TextField {...params} label="Select Assigned Route" size="small" />
                )}
              />
            </Box>
          </Box>

          <Button
            fullWidth
            sx={{
              mt: 4,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#16a34a",
              py: 1.2,
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
              "&:hover": { backgroundColor: "#15803d" },
            }}
            variant="contained"
            startIcon={<AltRouteOutlinedIcon />}
            onClick={handleAssignRoute}
          >
            Assign Route
          </Button>
        </Paper>
      </Box>

      {/* Expanded Announcement Creation Panel */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 3.5,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
            gap: 4,
          }}
        >
          {/* Form column */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: "10px",
                    backgroundColor: "#faf5ff",
                    color: "#9333ea",
                    display: "flex",
                  }}
                >
                  <CampaignOutlinedIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  {editingId ? "Edit Broadcast Message" : "Publish Announcement"}
                </Typography>
              </Box>

              {editingId && (
                <Button
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={handleCancelEdit}
                  sx={{ textTransform: "none", color: "#64748b" }}
                >
                  Cancel
                </Button>
              )}
            </Box>

            <TextField
              fullWidth
              placeholder="Announcement Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#cbd5e1" },
                },
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#cbd5e1" },
                },
              }}
            />

            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleAnnouncement}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#9333ea",
                px: 3.5,
                py: 1.1,
                boxShadow: "0 4px 12px rgba(147, 51, 234, 0.2)",
                "&:hover": { backgroundColor: "#7e22ce" },
              }}
            >
              {editingId ? "Update Broadcast" : "Send Announcement"}
            </Button>
          </Box>

          {/* Guidelines Sidebar Panel — redesigned as a short checklist
              instead of one long paragraph in an oversized box, and no
              longer force-stretched to match the (taller) form column,
              which was leaving a large empty purple gap at the bottom. */}
          <Box
            sx={{
              p: 3,
              borderRadius: "12px",
              backgroundColor: "#faf5ff",
              border: "1px solid #e9d5ff",
              alignSelf: "start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, color: "#7e22ce" }}>
              <InfoOutlinedIcon fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Announcement Guidelines
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#6b21a8", lineHeight: 1.6, mb: 1 }}>
              Keep in mind before you publish:
            </Typography>

            <List dense disablePadding>
              {[
                "Visible instantly to parents & drivers on mobile",
                "Keep the title short and the message specific",
                "Best for delays, route changes, or urgent notices",
                "Avoid frequent low-priority broadcasts",
              ].map((tip) => (
                <ListItem key={tip} disableGutters sx={{ py: 0.5, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 28, mt: 0.4 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: "#9333ea" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={tip}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { color: "#6b21a8", lineHeight: 1.5 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Paper>

      {/* Broadcast Cards Grid Stream */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Active Announcements Stream
          </Typography>
          <Chip
            label={`${announcements.length} Total`}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: "#f1f5f9",
              color: "#475569",
              borderRadius: "8px",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5,
          }}
        >
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <Paper
                key={item._id}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": { boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)" },
                  transition: "all 0.2s ease",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      {item.title}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingId(item._id);
                            setTitle(item.title);
                            setMessage(item.message);
                          }}
                          sx={{ color: "#2563eb", "&:hover": { backgroundColor: "#eff6ff" } }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteAnnouncement(item._id)}
                          sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fef2f2" } }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: "#475569", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                    {item.message}
                  </Typography>
                </Box>
              </Paper>
            ))
          ) : (
            <Paper
              elevation={0}
              sx={{
                gridColumn: "1 / -1",
                p: 5,
                textAlign: "center",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: "#94a3b8",
              }}
            >
              <Typography variant="body2">No broadcast announcements published yet.</Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() =>
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "left",
  }}
>
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Assignments;
