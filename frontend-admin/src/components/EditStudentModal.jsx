import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DirectionsBusOutlinedIcon from "@mui/icons-material/DirectionsBusOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { getParents } from "../services/parent.service";
import { getBusesByRoute } from "../services/assignment.service";
import { updateStudent } from "../services/student.service";
import { getRoutes } from "../services/route.service";

const EditStudentModal = ({
  open,
  handleClose,
  student,
  refreshStudents,
}) => {
  const [parents, setParents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeBuses, setRouteBuses] = useState([]);
  const [routeStops, setRouteStops] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingBuses, setLoadingBuses] = useState(false);

  const [formData, setFormData] = useState({
    admissionNumber: "",
    name: "",
    className: "",
    parentId: "",
    routeId: "",
    busId: "",
    pickupStop: "",
  });

  // --------------------------------------------------
  // Load parents and routes
  // --------------------------------------------------

  useEffect(() => {
    if (!open || !student) return;

    const loadInitialData = async () => {
      try {
        setLoading(true);

        const [parentsData, routesData] = await Promise.all([
          getParents(),
          getRoutes(),
        ]);

        const parentList = parentsData?.parents || [];
        const routeList = routesData?.routes || [];

        setParents(parentList);
        setRoutes(routeList);

        const parentId =
          typeof student.parentId === "object"
            ? student.parentId?._id
            : student.parentId || "";

        const routeId =
          typeof student.routeId === "object"
            ? student.routeId?._id
            : student.routeId || "";

        const busId =
          typeof student.busId === "object"
            ? student.busId?._id
            : student.busId || "";

        setFormData({
          admissionNumber: student.admissionNumber || "",
          name: student.name || "",
          className: student.className || "",
          parentId,
          routeId,
          busId,
          pickupStop: student.pickupStop || "",
        });

        // ----------------------------------------------
        // Find selected route
        // ----------------------------------------------

        const selectedRoute = routeList.find(
          (route) => route._id === routeId
        );

        if (selectedRoute) {
          const stops = selectedRoute.stops || [];

          // Remove first and last stop if they are route endpoints
          const filteredStops =
            stops.length > 2
              ? stops.slice(1, stops.length - 1)
              : stops;

          setRouteStops(filteredStops);

          // Load buses belonging to selected route
          if (routeId) {
            try {
              setLoadingBuses(true);

              const busData = await getBusesByRoute(routeId);

              setRouteBuses(busData?.buses || []);
            } catch (error) {
              console.error("Failed to load route buses:", error);
              setRouteBuses([]);
            } finally {
              setLoadingBuses(false);
            }
          }
        } else {
          setRouteStops([]);
          setRouteBuses([]);
        }
      } catch (error) {
        console.error("Failed to load student edit data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [open, student]);

  // --------------------------------------------------
  // Reset when dialog closes
  // --------------------------------------------------

  useEffect(() => {
    if (!open) {
      setRouteBuses([]);
      setRouteStops([]);
      setLoading(false);
      setLoadingBuses(false);
    }
  }, [open]);

  // --------------------------------------------------
  // Input change
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Route change
  // Route -> Buses + Pickup Stops
  // --------------------------------------------------

  const handleRouteChange = async (event) => {
    const routeId = event.target.value;

    setFormData((previous) => ({
      ...previous,
      routeId,
      busId: "",
      pickupStop: "",
    }));

    setRouteBuses([]);
    setRouteStops([]);

    if (!routeId) return;

    const selectedRoute = routes.find(
      (route) => route._id === routeId
    );

    if (selectedRoute) {
      const stops = selectedRoute.stops || [];

      const filteredStops =
        stops.length > 2
          ? stops.slice(1, stops.length - 1)
          : stops;

      setRouteStops(filteredStops);
    }

    try {
      setLoadingBuses(true);

      const data = await getBusesByRoute(routeId);

      setRouteBuses(data?.buses || []);
    } catch (error) {
      console.error("Failed to load buses:", error);
      setRouteBuses([]);
    } finally {
      setLoadingBuses(false);
    }
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async () => {
    if (!student?._id) {
      alert("Student information is missing.");
      return;
    }

    try {
      setLoading(true);

      await updateStudent(student._id, formData);

      if (refreshStudents) {
        await refreshStudents();
      }

      handleClose();
    } catch (error) {
      console.error("Failed to update student:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to update student"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Selected values
  // --------------------------------------------------

  const selectedParent = parents.find(
    (parent) => parent._id === formData.parentId
  );

  const selectedRoute = routes.find(
    (route) => route._id === formData.routeId
  );

  // --------------------------------------------------
  // Route display
  // --------------------------------------------------

  const getRouteLabel = (route) => {
    if (!route) return "";

    const stops = route.stops || [];

    const stopNames = stops
      .map((stop) => stop?.stopName)
      .filter(Boolean)
      .join(" → ");

    return stopNames
      ? `${route.routeName} (${stopNames})`
      : route.routeName || "";
  };

  // --------------------------------------------------
  // Pickup stop label
  // --------------------------------------------------

  const getStopLabel = (stop) => {
    return stop?.stopName || "";
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          maxHeight: "92vh",
        },
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "#fff",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 25 }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Edit Student
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                opacity: 0.9,
                mt: 0.4,
              }}
            >
              Update student and transport information
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            color: "#fff",
            backgroundColor: "rgba(255,255,255,0.12)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.22)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <DialogContent
        sx={{
          p: 2.5,
          backgroundColor: "#fafcff",
        }}
      >
        {loading && !student ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* =================================================
                STUDENT INFORMATION
            ================================================== */}

            <Box
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                p: 2.2,
                mb: 2,
              }}
            >
              {/* Section Header */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    backgroundColor: "#eaf3ff",
                    color: "#1976d2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SchoolOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#172033",
                    }}
                  >
                    Student Information
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#7b8794",
                    }}
                  >
                    Update the student's basic information
                  </Typography>
                </Box>
              </Box>

              {/* Fields */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 1.5,
                }}
              >
                <TextField
                  fullWidth
                  label="Admission Number"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Student Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Class"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  size="small"
                />

                {/* Parent */}

                <TextField
                  select
                  fullWidth
                  label="Parent Name"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  size="small"
                  SelectProps={{
                    displayEmpty: true,
                  }}
                >
                  <MenuItem value="">
                    Select parent
                  </MenuItem>

                  {parents.map((parent) => (
                    <MenuItem
                      key={parent._id}
                      value={parent._id}
                    >
                      {parent.name}
                      {parent.phone
                        ? ` (${parent.phone})`
                        : ""}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* =================================================
                TRANSPORT ASSIGNMENT
            ================================================== */}

            <Box
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                p: 2.2,
              }}
            >
              {/* Section Header */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    backgroundColor: "#eaf8f2",
                    color: "#11965c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DirectionsBusOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#172033",
                    }}
                  >
                    Transport Assignment
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#7b8794",
                    }}
                  >
                    Select route first. Available buses and
                    pickup stops will load automatically.
                  </Typography>
                </Box>
              </Box>

              {/* =================================================
                  ROUTE
              ================================================== */}

              <TextField
                select
                fullWidth
                label="Route"
                name="routeId"
                value={formData.routeId}
                onChange={handleRouteChange}
                size="small"
                sx={{ mb: 1.5 }}
              >
                <MenuItem value="">
                  Select route
                </MenuItem>

                {routes.map((route) => (
                  <MenuItem
                    key={route._id}
                    value={route._id}
                  >
                    {getRouteLabel(route)}
                  </MenuItem>
                ))}
              </TextField>

              {/* =================================================
                  BUS
              ================================================== */}

              <TextField
                select
                fullWidth
                label="Bus"
                name="busId"
                value={formData.busId}
                onChange={handleChange}
                size="small"
                disabled={!formData.routeId || loadingBuses}
                sx={{ mb: 1.5 }}
              >
                <MenuItem value="">
                  {!formData.routeId
                    ? "Select route first"
                    : loadingBuses
                    ? "Loading buses..."
                    : routeBuses.length === 0
                    ? "No buses available"
                    : "Select bus"}
                </MenuItem>

                {routeBuses.map((bus) => (
                  <MenuItem
                    key={bus._id}
                    value={bus._id}
                  >
                    {bus.busNumber || "Unnamed Bus"}
                  </MenuItem>
                ))}
              </TextField>

              {/* =================================================
                  PICKUP STOP
              ================================================== */}

              <TextField
                select
                fullWidth
                label="Pickup Stop"
                name="pickupStop"
                value={formData.pickupStop}
                onChange={handleChange}
                size="small"
                disabled={!formData.routeId}
              >
                <MenuItem value="">
                  {!formData.routeId
                    ? "Select route first"
                    : routeStops.length === 0
                    ? "No pickup stops available"
                    : "Select pickup stop"}
                </MenuItem>

                {routeStops.map((stop, index) => (
                  <MenuItem
                    key={
                      stop?._id ||
                      `${stop?.stopName}-${index}`
                    }
                    value={stop?.stopName || ""}
                  >
                    {getStopLabel(stop)}
                  </MenuItem>
                ))}
              </TextField>

              {/* Information */}

              {formData.routeId && (
                <Box
                  sx={{
                    mt: 2,
                    px: 1.5,
                    py: 1.2,
                    borderRadius: "9px",
                    backgroundColor: "#f0f7ff",
                    border: "1px solid #d5e9ff",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#24639b",
                    }}
                  >
                    Route selected:{" "}
                    <strong>
                      {selectedRoute?.routeName || "Route"}
                    </strong>
                    {" • "}
                    {routeBuses.length} bus
                    {routeBuses.length !== 1 ? "es" : ""}{" "}
                    available
                    {" • "}
                    {routeStops.length} pickup stop
                    {routeStops.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Divider />

      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          startIcon={<CancelOutlinedIcon />}
          sx={{
            color: "#64748b",
            fontWeight: 600,
            textTransform: "none",
            px: 2,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress
                size={17}
                color="inherit"
              />
            ) : (
              <SaveOutlinedIcon />
            )
          }
          sx={{
            borderRadius: "9px",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            background:
              "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            boxShadow:
              "0 4px 12px rgba(25,118,210,0.25)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
            },
          }}
        >
          {loading ? "Updating..." : "Update Student"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditStudentModal;