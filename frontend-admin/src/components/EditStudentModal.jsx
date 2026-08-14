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

  // Separate buses/stops for Pickup and Drop
  const [pickupBuses, setPickupBuses] = useState([]);
  const [dropBuses, setDropBuses] = useState([]);

  const [pickupStops, setPickupStops] = useState([]);
  const [dropStops, setDropStops] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingPickupBuses, setLoadingPickupBuses] = useState(false);
  const [loadingDropBuses, setLoadingDropBuses] = useState(false);

  const [formData, setFormData] = useState({
    admissionNumber: "",
    name: "",
    className: "",
    parentId: "",

    // Pickup
    pickupRouteId: "",
    pickupBusId: "",
    pickupStop: "",

    // Drop
    dropRouteId: "",
    dropBusId: "",
    dropStop: "",
  });

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getId = (value) => {
    if (!value) return "";

    return typeof value === "object"
      ? value?._id || ""
      : value;
  };

  const getRouteStops = (route) => {
    if (!route) return [];

    const stops = route.stops || [];

    return stops.length > 2
      ? stops.slice(1, stops.length - 1)
      : stops;
  };

  const getStopLabel = (stop) => {
    return stop?.stopName || "";
  };

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
  // Load parents/routes + existing student data
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

        const parentId = getId(student.parentId);

        const pickupRouteId = getId(student.pickupRouteId);
        const pickupBusId = getId(student.pickupBusId);

        const dropRouteId = getId(student.dropRouteId);
        const dropBusId = getId(student.dropBusId);

        setFormData({
          admissionNumber: student.admissionNumber || "",
          name: student.name || "",
          className: student.className || "",
          parentId,

          pickupRouteId,
          pickupBusId,
          pickupStop: student.pickupStop || "",

          dropRouteId,
          dropBusId,
          dropStop: student.dropStop || "",
        });

        // -----------------------------
        // Load Pickup route data
        // -----------------------------

        const pickupRoute = routeList.find(
          (route) => route._id === pickupRouteId
        );

        if (pickupRoute) {
          setPickupStops(getRouteStops(pickupRoute));
        } else {
          setPickupStops([]);
        }

        if (pickupRouteId) {
          try {
            setLoadingPickupBuses(true);

            const busData =
              await getBusesByRoute(pickupRouteId);

            setPickupBuses(busData?.buses || []);
          } catch (error) {
            console.error(
              "Failed to load pickup route buses:",
              error
            );

            setPickupBuses([]);
          } finally {
            setLoadingPickupBuses(false);
          }
        } else {
          setPickupBuses([]);
        }

        // -----------------------------
        // Load Drop route data
        // -----------------------------

        const dropRoute = routeList.find(
          (route) => route._id === dropRouteId
        );

        if (dropRoute) {
          setDropStops(getRouteStops(dropRoute));
        } else {
          setDropStops([]);
        }

        if (dropRouteId) {
          try {
            setLoadingDropBuses(true);

            const busData =
              await getBusesByRoute(dropRouteId);

            setDropBuses(busData?.buses || []);
          } catch (error) {
            console.error(
              "Failed to load drop route buses:",
              error
            );

            setDropBuses([]);
          } finally {
            setLoadingDropBuses(false);
          }
        } else {
          setDropBuses([]);
        }
      } catch (error) {
        console.error(
          "Failed to load student edit data:",
          error
        );
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
      setPickupBuses([]);
      setDropBuses([]);
      setPickupStops([]);
      setDropStops([]);

      setLoading(false);
      setLoadingPickupBuses(false);
      setLoadingDropBuses(false);
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
  // Pickup Route change
  // Route -> Pickup Bus + Pickup Stops
  // --------------------------------------------------

  const handlePickupRouteChange = async (event) => {
    const pickupRouteId = event.target.value;

    setFormData((previous) => ({
      ...previous,
      pickupRouteId,
      pickupBusId: "",
      pickupStop: "",
    }));

    setPickupBuses([]);
    setPickupStops([]);

    if (!pickupRouteId) return;

    const selectedRoute = routes.find(
      (route) => route._id === pickupRouteId
    );

    if (selectedRoute) {
      setPickupStops(
        getRouteStops(selectedRoute)
      );
    }

    try {
      setLoadingPickupBuses(true);

      const data =
        await getBusesByRoute(pickupRouteId);

      setPickupBuses(data?.buses || []);
    } catch (error) {
      console.error(
        "Failed to load pickup buses:",
        error
      );

      setPickupBuses([]);
    } finally {
      setLoadingPickupBuses(false);
    }
  };

  // --------------------------------------------------
  // Drop Route change
  // Route -> Drop Bus + Drop Stops
  // --------------------------------------------------

  const handleDropRouteChange = async (event) => {
    const dropRouteId = event.target.value;

    setFormData((previous) => ({
      ...previous,
      dropRouteId,
      dropBusId: "",
      dropStop: "",
    }));

    setDropBuses([]);
    setDropStops([]);

    if (!dropRouteId) return;

    const selectedRoute = routes.find(
      (route) => route._id === dropRouteId
    );

    if (selectedRoute) {
      setDropStops(
        getRouteStops(selectedRoute)
      );
    }

    try {
      setLoadingDropBuses(true);

      const data =
        await getBusesByRoute(dropRouteId);

      setDropBuses(data?.buses || []);
    } catch (error) {
      console.error(
        "Failed to load drop buses:",
        error
      );

      setDropBuses([]);
    } finally {
      setLoadingDropBuses(false);
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

      await updateStudent(
        student._id,
        formData
      );

      if (refreshStudents) {
        await refreshStudents();
      }

      handleClose();
    } catch (error) {
      console.error(
        "Failed to update student:",
        error
      );

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
    (parent) =>
      parent._id === formData.parentId
  );

  const selectedPickupRoute = routes.find(
    (route) =>
      route._id === formData.pickupRouteId
  );

  const selectedDropRoute = routes.find(
    (route) =>
      route._id === formData.dropRouteId
  );

  const pickupRoutes =
  routes.filter(
    (route) =>
      route.tripType === "PICKUP"
  );

const dropRoutes =
  routes.filter(
    (route) =>
      route.tripType === "DROP"
  );

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
              backgroundColor:
                "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditOutlinedIcon
              sx={{ fontSize: 25 }}
            />
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
            backgroundColor:
              "rgba(255,255,255,0.12)",
            "&:hover": {
              backgroundColor:
                "rgba(255,255,255,0.22)",
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
                border:
                  "1px solid #e2e8f0",
                borderRadius: "14px",
                p: 2.2,
                mb: 2,
              }}
            >
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
                  value={
                    formData.admissionNumber
                  }
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
                  value={
                    formData.className
                  }
                  onChange={handleChange}
                  size="small"
                />

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
                PICKUP TRANSPORT
            ================================================== */}

            <Box
              sx={{
                backgroundColor: "#fff",
                border:
                  "1px solid #bfdbfe",
                borderRadius: "14px",
                p: 2.2,
                mb: 2,
              }}
            >
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
                    Pickup Transport
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#7b8794",
                    }}
                  >
                    Select the bus and route used to pick up the student.
                  </Typography>
                </Box>
              </Box>

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
                  select
                  fullWidth
                  label="Pickup Route"
                  name="pickupRouteId"
                  value={
                    formData.pickupRouteId
                  }
                  onChange={
                    handlePickupRouteChange
                  }
                  size="small"
                  sx={{
                    gridColumn: {
                      xs: "auto",
                      sm: "1 / -1",
                    },
                  }}
                >
                  <MenuItem value="">
                    Select pickup route
                  </MenuItem>
                    {pickupRoutes.map((route) => (
                      <MenuItem
                        key={route._id}
                        value={route._id}
                      >
                        {getRouteLabel(route)}
                      </MenuItem>
                    ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Pickup Bus"
                  name="pickupBusId"
                  value={
                    formData.pickupBusId
                  }
                  onChange={handleChange}
                  size="small"
                  disabled={
                    !formData.pickupRouteId ||
                    loadingPickupBuses
                  }
                >
                  <MenuItem value="">
                    {!formData.pickupRouteId
                      ? "Select route first"
                      : loadingPickupBuses
                      ? "Loading buses..."
                      : pickupBuses.length === 0
                      ? "No buses available"
                      : "Select pickup bus"}
                  </MenuItem>

                  {pickupBuses.map((bus) => (
                    <MenuItem
                      key={bus._id}
                      value={bus._id}
                    >
                      {bus.busNumber ||
                        "Unnamed Bus"}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Pickup Stop"
                  name="pickupStop"
                  value={
                    formData.pickupStop
                  }
                  onChange={handleChange}
                  size="small"
                  disabled={
                    !formData.pickupRouteId
                  }
                >
                  <MenuItem value="">
                    {!formData.pickupRouteId
                      ? "Select route first"
                      : pickupStops.length === 0
                      ? "No pickup stops available"
                      : "Select pickup stop"}
                  </MenuItem>

                  {pickupStops.map(
                    (stop, index) => (
                      <MenuItem
                        key={
                          stop?._id ||
                          `${stop?.stopName}-${index}`
                        }
                        value={
                          stop?.stopName || ""
                        }
                      >
                        {getStopLabel(stop)}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Box>

              {formData.pickupRouteId && (
                <Box
                  sx={{
                    mt: 2,
                    px: 1.5,
                    py: 1.2,
                    borderRadius: "9px",
                    backgroundColor: "#f0f7ff",
                    border:
                      "1px solid #d5e9ff",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#24639b",
                    }}
                  >
                    Pickup route:{" "}
                    <strong>
                      {selectedPickupRoute?.routeName ||
                        "Route"}
                    </strong>
                    {" • "}
                    {pickupBuses.length} bus
                    {pickupBuses.length !== 1
                      ? "es"
                      : ""}{" "}
                    available
                    {" • "}
                    {pickupStops.length} stop
                    {pickupStops.length !== 1
                      ? "s"
                      : ""}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* =================================================
                DROP TRANSPORT
            ================================================== */}

            <Box
              sx={{
                backgroundColor: "#fff",
                border:
                  "1px solid #bbf7d0",
                borderRadius: "14px",
                p: 2.2,
              }}
            >
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
                    Drop Transport
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#7b8794",
                    }}
                  >
                    Select the bus and route used to drop the student.
                  </Typography>
                </Box>
              </Box>

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
                  select
                  fullWidth
                  label="Drop Route"
                  name="dropRouteId"
                  value={
                    formData.dropRouteId
                  }
                  onChange={
                    handleDropRouteChange
                  }
                  size="small"
                  sx={{
                    gridColumn: {
                      xs: "auto",
                      sm: "1 / -1",
                    },
                  }}
                >
                  <MenuItem value="">
                    Select drop route
                  </MenuItem>

                  {dropRoutes.map((route) => (
                    <MenuItem
                      key={route._id}
                      value={route._id}
                    >
                      {getRouteLabel(route)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Drop Bus"
                  name="dropBusId"
                  value={
                    formData.dropBusId
                  }
                  onChange={handleChange}
                  size="small"
                  disabled={
                    !formData.dropRouteId ||
                    loadingDropBuses
                  }
                >
                  <MenuItem value="">
                    {!formData.dropRouteId
                      ? "Select route first"
                      : loadingDropBuses
                      ? "Loading buses..."
                      : dropBuses.length === 0
                      ? "No buses available"
                      : "Select drop bus"}
                  </MenuItem>

                  {dropBuses.map((bus) => (
                    <MenuItem
                      key={bus._id}
                      value={bus._id}
                    >
                      {bus.busNumber ||
                        "Unnamed Bus"}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Drop Stop"
                  name="dropStop"
                  value={
                    formData.dropStop
                  }
                  onChange={handleChange}
                  size="small"
                  disabled={
                    !formData.dropRouteId
                  }
                >
                  <MenuItem value="">
                    {!formData.dropRouteId
                      ? "Select route first"
                      : dropStops.length === 0
                      ? "No drop stops available"
                      : "Select drop stop"}
                  </MenuItem>

                  {dropStops.map(
                    (stop, index) => (
                      <MenuItem
                        key={
                          stop?._id ||
                          `${stop?.stopName}-${index}`
                        }
                        value={
                          stop?.stopName || ""
                        }
                      >
                        {getStopLabel(stop)}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Box>

              {formData.dropRouteId && (
                <Box
                  sx={{
                    mt: 2,
                    px: 1.5,
                    py: 1.2,
                    borderRadius: "9px",
                    backgroundColor: "#f0fdf4",
                    border:
                      "1px solid #dcfce7",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#237a4b",
                    }}
                  >
                    Drop route:{" "}
                    <strong>
                      {selectedDropRoute?.routeName ||
                        "Route"}
                    </strong>
                    {" • "}
                    {dropBuses.length} bus
                    {dropBuses.length !== 1
                      ? "es"
                      : ""}{" "}
                    available
                    {" • "}
                    {dropStops.length} stop
                    {dropStops.length !== 1
                      ? "s"
                      : ""}
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
          startIcon={
            <CancelOutlinedIcon />
          }
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
          {loading
            ? "Updating..."
            : "Update Student"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditStudentModal;
