import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Divider,
  InputAdornment,
  CircularProgress,
  Paper,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

// MUI v9 individual icon imports
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import FamilyRestroomOutlined from "@mui/icons-material/FamilyRestroomOutlined";
import RouteOutlined from "@mui/icons-material/RouteOutlined";
import DirectionsBusOutlined from "@mui/icons-material/DirectionsBusOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import WcOutlined from "@mui/icons-material/WcOutlined";

import { getParents } from "../services/parent.service";
import { createStudent } from "../services/student.service";
import { getRoutes } from "../services/route.service";
import { getBusesByRoute } from "../services/assignment.service";


/*
 * =========================================================
 * MODULE-LEVEL CACHE
 *
 * Parents and routes rarely change between modal opens.
 * Cache them in memory (survives across opens, resets on
 * page reload) so reopening the modal renders instantly
 * instead of re-hitting the network every time.
 * =========================================================
 */

let dataCache = {
  parents: null,
  routes: null,
  timestamp: 0,
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Kept outside the component so the array isn't recreated every render.
const GENDER_OPTIONS = ["Male", "Female", "Other"];


const AddStudentModal = ({
  open,
  handleClose,
  refreshStudents,
}) => {
  /*
   * =========================================================
   * INITIAL FORM
   * =========================================================
   */

  const initialFormData = {
  admissionNumber: "",
  name: "",
  className: "",
  gender: "",
  parentId: "",

  // Pickup
  pickupRouteId: "",
  pickupBusId: "",
  pickupStop: "",

  // Drop
  dropRouteId: "",
  dropBusId: "",
  dropStop: "",
};


  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [parents, setParents] =
  useState(dataCache.parents || []);

const [routes, setRoutes] =
  useState(dataCache.routes || []);


// ==========================================
// PICKUP TRANSPORT STATE
// ==========================================

const [pickupBuses, setPickupBuses] =
  useState([]);

const [pickupStops, setPickupStops] =
  useState([]);


// ==========================================
// DROP TRANSPORT STATE
// ==========================================

const [dropBuses, setDropBuses] =
  useState([]);

const [dropStops, setDropStops] =
  useState([]);


const [formData, setFormData] =
  useState(initialFormData);

const [loading, setLoading] =
  useState(false);

const [loadingPickupBuses, setLoadingPickupBuses] =
  useState(false);

const [loadingDropBuses, setLoadingDropBuses] =
  useState(false);

const [saving, setSaving] =
  useState(false);

const [errors, setErrors] =
  useState({});


  /*
   * =========================================================
   * LOAD PARENTS AND ROUTES (cache-first, stale-while-revalidate)
   * =========================================================
   */

  // useEffect(() => {
  //   if (!open) {
  //     return;
  //   }

  //   const isCacheFresh =
  //     dataCache.parents &&
  //     dataCache.routes &&
  //     Date.now() - dataCache.timestamp < CACHE_TTL_MS;

  //   if (isCacheFresh) {
  //     // Cache is warm: render instantly, no spinner, no network wait
  //     setParents(dataCache.parents);
  //     setRoutes(dataCache.routes);
  //     setLoading(false);
  //     return;
  //   }

  //   // Cache is empty or stale: show cached data (if any) immediately
  //   // while we revalidate in the background
  //   if (dataCache.parents) setParents(dataCache.parents);
  //   if (dataCache.routes) setRoutes(dataCache.routes);

  //   const loadData = async () => {
  //     setLoading(true);

  //     try {
  //       const [parentsResult, routesResult] =
  //         await Promise.allSettled([
  //           getParents(),
  //           getRoutes(),
  //         ]);

  //       const parentsData =
  //         parentsResult.status === "fulfilled"
  //           ? parentsResult.value?.parents || []
  //           : dataCache.parents || [];

  //       const routesData =
  //         routesResult.status === "fulfilled"
  //           ? routesResult.value?.routes || []
  //           : dataCache.routes || [];

  //       setParents(parentsData);
  //       setRoutes(routesData);

  //       dataCache = {
  //         parents: parentsData,
  //         routes: routesData,
  //         timestamp: Date.now(),
  //       };

  //       if (parentsResult.status === "rejected") {
  //         console.error(
  //           "Error loading parents:",
  //           parentsResult.reason
  //         );
  //       }

  //       if (routesResult.status === "rejected") {
  //         console.error(
  //           "Error loading routes:",
  //           routesResult.reason
  //         );
  //       }

  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [open]);

useEffect(() => {
  if (!open) {
    return;
  }

  // Show cached data immediately if available
  if (dataCache.parents) {
    setParents(dataCache.parents);
  }

  if (dataCache.routes) {
    setRoutes(dataCache.routes);
  }

  const loadData = async () => {
    setLoading(true);

    try {
      const [parentsResult, routesResult] =
        await Promise.allSettled([
          getParents(),
          getRoutes(),
        ]);

      const parentsData =
        parentsResult.status === "fulfilled"
          ? parentsResult.value?.parents || []
          : dataCache.parents || [];

      const routesData =
        routesResult.status === "fulfilled"
          ? routesResult.value?.routes || []
          : dataCache.routes || [];

      // Always update state with latest data
      setParents(parentsData);
      setRoutes(routesData);

      // Update cache with latest data
      dataCache = {
        parents: parentsData,
        routes: routesData,
        timestamp: Date.now(),
      };

      if (parentsResult.status === "rejected") {
        console.error(
          "Error loading parents:",
          parentsResult.reason
        );
      }

      if (routesResult.status === "rejected") {
        console.error(
          "Error loading routes:",
          routesResult.reason
        );
      }

    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [open]);


  /*
   * =========================================================
   * RESET WHEN MODAL CLOSES
   * =========================================================
   */

  useEffect(() => {
  if (!open) {
    setFormData(initialFormData);

    setPickupBuses([]);
    setPickupStops([]);

    setDropBuses([]);
    setDropStops([]);

    setErrors({});

    setLoadingPickupBuses(false);
    setLoadingDropBuses(false);
  }
}, [open]);


  /*
   * =========================================================
   * NORMAL TEXT FIELD CHANGE
   * =========================================================
   */

  // ==========================================
// FILTER ROUTES BY TRIP TYPE
// ==========================================

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

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };


  /*
   * =========================================================
   * PARENT
   * =========================================================
   */

  const handleParentChange = (_, value) => {
    setFormData((previous) => ({
      ...previous,
      parentId: value?._id || "",
    }));

    setErrors((previous) => ({
      ...previous,
      parentId: "",
    }));
  };


  /*
 * =========================================================
 * PICKUP ROUTE
 * =========================================================
 */

const handlePickupRouteChange = async (_, value) => {

  const pickupRouteId =
    value?._id || "";

  setFormData((previous) => ({
    ...previous,

    pickupRouteId,

    pickupBusId: "",
    pickupStop: "",
  }));


  // Clear old pickup data
  setPickupBuses([]);
  setPickupStops([]);


  setErrors((previous) => ({
    ...previous,

    pickupRouteId: "",
    pickupBusId: "",
    pickupStop: "",
  }));


  if (!value) {
    return;
  }


  // ==========================================
  // LOAD PICKUP STOPS
  // ==========================================

  if (
    Array.isArray(value.stops) &&
    value.stops.length > 2
  ) {

    const filteredStops =
      value.stops.slice(
        1,
        value.stops.length - 1
      );

    setPickupStops(filteredStops);

  } else {

    setPickupStops(
      value.stops || []
    );

  }


  // ==========================================
  // LOAD BUSES ASSIGNED TO PICKUP ROUTE
  // ==========================================

  if (pickupRouteId) {

    try {

      setLoadingPickupBuses(true);

      const data =
        await getBusesByRoute(
          pickupRouteId
        );

      setPickupBuses(
        data?.buses || []
      );

    } catch (error) {

      console.error(
        "Error loading pickup buses for route:",
        error
      );

      setPickupBuses([]);

    } finally {

      setLoadingPickupBuses(false);

    }

  }

};


/*
 * =========================================================
 * PICKUP BUS
 * =========================================================
 */

const handlePickupBusChange = (_, value) => {

  setFormData((previous) => ({
    ...previous,

    pickupBusId:
      value?._id || "",
  }));


  setErrors((previous) => ({
    ...previous,

    pickupBusId: "",
  }));

};


/*
 * =========================================================
 * PICKUP STOP
 * =========================================================
 */

const handlePickupStopChange = (_, value) => {

  setFormData((previous) => ({
    ...previous,

    pickupStop:
      value?.stopName || "",
  }));


  setErrors((previous) => ({
    ...previous,

    pickupStop: "",
  }));

};


/*
 * =========================================================
 * DROP ROUTE
 * =========================================================
 */

const handleDropRouteChange = async (_, value) => {

  const dropRouteId =
    value?._id || "";

  setFormData((previous) => ({
    ...previous,

    dropRouteId,

    dropBusId: "",
    dropStop: "",
  }));


  // Clear old drop data
  setDropBuses([]);
  setDropStops([]);


  setErrors((previous) => ({
    ...previous,

    dropRouteId: "",
    dropBusId: "",
    dropStop: "",
  }));


  if (!value) {
    return;
  }


  // ==========================================
  // LOAD DROP STOPS
  // ==========================================

  if (
    Array.isArray(value.stops) &&
    value.stops.length > 2
  ) {

    const filteredStops =
      value.stops.slice(
        1,
        value.stops.length - 1
      );

    setDropStops(filteredStops);

  } else {

    setDropStops(
      value.stops || []
    );

  }


  // ==========================================
  // LOAD BUSES ASSIGNED TO DROP ROUTE
  // ==========================================

  if (dropRouteId) {

    try {

      setLoadingDropBuses(true);

      const data =
        await getBusesByRoute(
          dropRouteId
        );

      setDropBuses(
        data?.buses || []
      );

    } catch (error) {

      console.error(
        "Error loading drop buses for route:",
        error
      );

      setDropBuses([]);

    } finally {

      setLoadingDropBuses(false);

    }

  }

};


/*
 * =========================================================
 * DROP BUS
 * =========================================================
 */

const handleDropBusChange = (_, value) => {

  setFormData((previous) => ({
    ...previous,

    dropBusId:
      value?._id || "",
  }));


  setErrors((previous) => ({
    ...previous,

    dropBusId: "",
  }));

};


/*
 * =========================================================
 * DROP STOP
 * =========================================================
 */

const handleDropStopChange = (_, value) => {

  setFormData((previous) => ({
    ...previous,

    dropStop:
      value?.stopName || "",
  }));


  setErrors((previous) => ({
    ...previous,

    dropStop: "",
  }));

};
  /*
   * =========================================================
   * VALIDATION
   * =========================================================
   */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber =
        "Admission number is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Student name is required";
    }

    if (!formData.className.trim()) {
      newErrors.className = "Class is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
    }

    if (!formData.parentId) {
      newErrors.parentId = "Please select a parent";
    }

    if (!formData.pickupRouteId) {
  newErrors.pickupRouteId =
    "Please select a pickup route";
}

if (!formData.pickupBusId) {
  newErrors.pickupBusId =
    "Please select a pickup bus";
}

if (!formData.pickupStop) {
  newErrors.pickupStop =
    "Please select a pickup stop";
}

if (!formData.dropRouteId) {
  newErrors.dropRouteId =
    "Please select a drop route";
}

if (!formData.dropBusId) {
  newErrors.dropBusId =
    "Please select a drop bus";
}

if (!formData.dropStop) {
  newErrors.dropStop =
    "Please select a drop stop";
}

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  /*
   * =========================================================
   * SAVE STUDENT
   * =========================================================
   */

  const handleSubmit = async () => {
    if (saving) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setSaving(true);

      await createStudent(formData);

      if (refreshStudents) {
        await refreshStudents();
      }

     setFormData(initialFormData);

setPickupBuses([]);
setPickupStops([]);

setDropBuses([]);
setDropStops([]);

setErrors({});

      handleClose();

    } catch (error) {
      console.error(
        "Error creating student:",
        error
      );

    } finally {
      setSaving(false);
    }
  };


  /*
   * =========================================================
   * SELECTED VALUES
   * =========================================================
   */

 const selectedParent =
  parents.find(
    (parent) => parent._id === formData.parentId
  ) || null;

const selectedPickupRoute =
  pickupRoutes.find(
    (route) => route._id === formData.pickupRouteId
  ) || null;

const selectedPickupBus =
  pickupBuses.find(
    (bus) => bus._id === formData.pickupBusId
  ) || null;

const selectedPickupStop =
  pickupStops.find(
    (stop) => stop.stopName === formData.pickupStop
  ) || null;

const selectedDropRoute =
  dropRoutes.find(
    (route) => route._id === formData.dropRouteId
  ) || null;

const selectedDropBus =
  dropBuses.find(
    (bus) => bus._id === formData.dropBusId
  ) || null;

const selectedDropStop =
  dropStops.find(
    (stop) => stop.stopName === formData.dropStop
  ) || null;

  /*
   * =========================================================
   * COMMON FIELD STYLE
   * =========================================================
   */

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: "46px",
      borderRadius: "10px",
      backgroundColor: "#ffffff",

      "& fieldset": {
        borderColor: "#d7dce5",
      },

      "&:hover fieldset": {
        borderColor: "#1976d2",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
        borderWidth: "1.5px",
      },
    },

    "& .MuiInputLabel-root": {
      fontSize: "14px",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#1976d2",
    },
  };

  const skeletonSx = {
    borderRadius: "10px",
    height: 46,
  };


  /*
   * =========================================================
   * SECTION HEADER
   * =========================================================
   */

  const SectionHeader = ({ icon, title, subtitle }) => (
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#eaf2ff",
          color: "#1976d2",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#172033",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "12px",
            color: "#7a8499",
            mt: 0.35,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );


  /*
   * =========================================================
   * AUTOCOMPLETE INPUT HELPER (MUI v9 — uses slotProps, not InputProps)
   * =========================================================
   */

  const autocompleteInputProps = (
    params,
    icon,
    placeholder,
    error,
    helperText
  ) => (
    <TextField
      {...params}
      required
      placeholder={placeholder}
      size="small"
      error={Boolean(error)}
      helperText={helperText || ""}
      sx={fieldSx}
      slotProps={{
        ...params.slotProps,
        input: {
          ...params.slotProps?.input,
          startAdornment: (
            <>
              <InputAdornment position="start">
                {icon}
              </InputAdornment>
              {params.slotProps?.input?.startAdornment}
            </>
          ),
        },
      }}
    />
  );


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            maxHeight: "92vh",
          },
        },
      }}
    >

      {/* HEADER */}
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2.2,
          background:
            "linear-gradient(135deg, #1976d2 0%, #1255a3 100%)",
          color: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonOutlined />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "18px", sm: "20px" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Add Student
              </Typography>

              <Typography sx={{ fontSize: "12px", opacity: 0.85, mt: 0.4 }}>
                Add student details and assign transport
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={handleClose}
            disabled={saving}
            sx={{
              minWidth: 36,
              width: 36,
              height: 36,
              borderRadius: "10px",
              color: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.12)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.22)" },
            }}
          >
            <CloseOutlined fontSize="small" />
          </Button>
        </Box>
      </DialogTitle>


      {/* CONTENT — always renders immediately, no full-page blocking spinner */}
      <DialogContent sx={{ p: { xs: 1.5, sm: 3 }, backgroundColor: "#f7f9fc" }}>
        <Box>

          {/* STUDENT INFORMATION */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.8, sm: 2.5 },
              borderRadius: "14px",
              border: "1px solid #e5e9f0",
              backgroundColor: "#ffffff",
              mb: 2,
            }}
          >
            <SectionHeader
              icon={<PersonOutlined fontSize="small" />}
              title="Student Information"
              subtitle="Enter the student's basic details"
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                autoFocus
                required
                label="Admission Number"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                placeholder="e.g. ADM-2026-001"
                size="small"
                error={Boolean(errors.admissionNumber)}
                helperText={errors.admissionNumber || ""}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlined sx={{ color: "#7b8794", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                required
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student's full name"
                size="small"
                error={Boolean(errors.name)}
                helperText={errors.name || ""}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined sx={{ color: "#7b8794", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                required
                label="Class"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="e.g. Class 8-A"
                size="small"
                error={Boolean(errors.className)}
                helperText={errors.className || ""}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolOutlined sx={{ color: "#7b8794", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* GENDER */}
              <FormControl
                fullWidth
                required
                size="small"
                error={Boolean(errors.gender)}
                sx={fieldSx}
              >
                <InputLabel id="gender-select-label">Gender</InputLabel>
                <Select
                  labelId="gender-select-label"
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <WcOutlined sx={{ color: "#7b8794", fontSize: 20 }} />
                    </InputAdornment>
                  }
                >
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.gender && (
                  <FormHelperText>{errors.gender}</FormHelperText>
                )}
              </FormControl>

              {/* PARENT — skeleton only while parents are loading */}
              {loading && parents.length === 0 ? (
                <Skeleton variant="rounded" sx={skeletonSx} />
              ) : (
                <Autocomplete
                  fullWidth
                  options={parents}
                  value={selectedParent}
                  onChange={handleParentChange}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) =>
                    option?.name
                      ? `${option.name}${option.phone ? ` (${option.phone})` : ""}`
                      : ""
                  }
                  noOptionsText="No parents found"
                  renderInput={(params) =>
                    autocompleteInputProps(
                      params,
                      <FamilyRestroomOutlined sx={{ color: "#7b8794", fontSize: 20 }} />,
                      "Search parent",
                      errors.parentId,
                      errors.parentId
                    )
                  }
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      key={option._id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start !important",
                        py: "9px !important",
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      {option.phone && (
                        <Typography sx={{ fontSize: "12px", color: "#7b8794", mt: 0.2 }}>
                          {option.phone}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              )}
            </Box>
          </Paper>


         {/* TRANSPORT ASSIGNMENT */}
<Paper
  elevation={0}
  sx={{
    p: { xs: 1.8, sm: 2.5 },
    borderRadius: "14px",
    border: "1px solid #e5e9f0",
    backgroundColor: "#ffffff",
  }}
>
  <SectionHeader
    icon={<DirectionsBusOutlined fontSize="small" />}
    title="Transport Assignment"
    subtitle="Assign separate pickup and drop transport"
  />

  {/* ============================= */}
  {/* PICKUP */}
  {/* ============================= */}

  <Box
    sx={{
      mb: 3,
      p: 2,
      borderRadius: "12px",
      backgroundColor: "#f8fbff",
      border: "1px solid #dceaff",
    }}
  >
    <Typography
      sx={{
        fontSize: "14px",
        fontWeight: 700,
        color: "#1976d2",
        mb: 1.5,
      }}
    >
      Pickup Transport
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
        },
        gap: 2,
      }}
    >

      {/* PICKUP ROUTE */}
      <Autocomplete
        fullWidth
        options={pickupRoutes}
        value={selectedPickupRoute}
        onChange={handlePickupRouteChange}
        isOptionEqualToValue={(option, value) =>
          option._id === value._id
        }
        getOptionLabel={(option) => {
          if (!option?.routeName) return "";

          const stops =
            option?.stops
              ?.map((stop) => stop.stopName)
              ?.join(" → ") || "";

          return stops
            ? `${option.routeName} (${stops})`
            : option.routeName;
        }}
        noOptionsText="No pickup routes found"
        renderInput={(params) =>
          autocompleteInputProps(
            params,
            <RouteOutlined
              sx={{
                color: "#7b8794",
                fontSize: 20,
              }}
            />,
            "Select pickup route",
            errors.pickupRouteId,
            errors.pickupRouteId
          )
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option._id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start !important",
              py: "10px !important",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {option.routeName}
            </Typography>

            {option.stops?.length > 0 && (
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#7b8794",
                  mt: 0.3,
                  lineHeight: 1.4,
                }}
              >
                {option.stops
                  .map((stop) => stop.stopName)
                  .join(" → ")}
              </Typography>
            )}
          </Box>
        )}
      />

      {/* PICKUP BUS */}
      <Autocomplete
        fullWidth
        options={pickupBuses}
        value={selectedPickupBus}
        onChange={handlePickupBusChange}
        disabled={
          !formData.pickupRouteId ||
          loadingPickupBuses
        }
        isOptionEqualToValue={(option, value) =>
          option._id === value._id
        }
        getOptionLabel={(option) =>
          option?.busNumber
            ? `${option.busNumber}${
                option.vehicleNumber
                  ? ` (${option.vehicleNumber})`
                  : ""
              }`
            : ""
        }
        noOptionsText={
          formData.pickupRouteId
            ? "No buses assigned to this route"
            : "Select pickup route first"
        }
        renderInput={(params) =>
          autocompleteInputProps(
            params,
            loadingPickupBuses ? (
              <CircularProgress size={18} />
            ) : (
              <DirectionsBusOutlined
                sx={{
                  color: formData.pickupRouteId
                    ? "#7b8794"
                    : "#b5bdc9",
                  fontSize: 20,
                }}
              />
            ),
            formData.pickupRouteId
              ? "Select pickup bus"
              : "Select pickup route first",
            errors.pickupBusId,
            errors.pickupBusId
          )
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option._id}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {option.busNumber}
              </Typography>

              {option.vehicleNumber && (
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#7b8794",
                    mt: 0.2,
                  }}
                >
                  Vehicle: {option.vehicleNumber}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      />

      {/* PICKUP STOP */}
      <Autocomplete
        fullWidth
        options={pickupStops}
        value={selectedPickupStop}
        onChange={handlePickupStopChange}
        disabled={!formData.pickupRouteId}
        isOptionEqualToValue={(option, value) =>
          option.stopName === value.stopName
        }
        getOptionLabel={(option) =>
          option?.stopName || ""
        }
        noOptionsText={
          formData.pickupRouteId
            ? "No pickup stops available"
            : "Select pickup route first"
        }
        renderInput={(params) =>
          autocompleteInputProps(
            params,
            <LocationOnOutlined
              sx={{
                color: formData.pickupRouteId
                  ? "#7b8794"
                  : "#b5bdc9",
                fontSize: 20,
              }}
            />,
            formData.pickupRouteId
              ? "Select pickup stop"
              : "Select pickup route first",
            errors.pickupStop,
            errors.pickupStop
          )
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option._id || option.stopName}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LocationOnOutlined
              sx={{
                color: "#1976d2",
                fontSize: 18,
              }}
            />

            <Typography
              sx={{
                fontSize: "14px",
              }}
            >
              {option.stopName}
            </Typography>
          </Box>
        )}
      />

    </Box>
  </Box>


  {/* ============================= */}
  {/* DROP */}
  {/* ============================= */}

  <Box
    sx={{
      p: 2,
      borderRadius: "12px",
      backgroundColor: "#fffaf5",
      border: "1px solid #ffe2c2",
    }}
  >
    <Typography
      sx={{
        fontSize: "14px",
        fontWeight: 700,
        color: "#ed6c02",
        mb: 1.5,
      }}
    >
      Drop Transport
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
        },
        gap: 2,
      }}
    >

      {/* DROP ROUTE */}
      <Autocomplete
        fullWidth
        options={dropRoutes}
        value={selectedDropRoute}
        onChange={handleDropRouteChange}
        isOptionEqualToValue={(option, value) =>
          option._id === value._id
        }
        getOptionLabel={(option) => {
          if (!option?.routeName) return "";

          const stops =
            option?.stops
              ?.map((stop) => stop.stopName)
              ?.join(" → ") || "";

          return stops
            ? `${option.routeName} (${stops})`
            : option.routeName;
        }}
        noOptionsText="No drop routes found"
        renderInput={(params) =>
          autocompleteInputProps(
            params,
            <RouteOutlined
              sx={{
                color: "#7b8794",
                fontSize: 20,
              }}
            />,
            "Select drop route",
            errors.dropRouteId,
            errors.dropRouteId
          )
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option._id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start !important",
              py: "10px !important",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {option.routeName}
            </Typography>

            {option.stops?.length > 0 && (
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#7b8794",
                  mt: 0.3,
                  lineHeight: 1.4,
                }}
              >
                {option.stops
                  .map((stop) => stop.stopName)
                  .join(" → ")}
              </Typography>
            )}
          </Box>
        )}
      />

      {/* DROP BUS */}
      <Autocomplete
        fullWidth
        options={dropBuses}
        value={selectedDropBus}
        onChange={handleDropBusChange}
        disabled={
          !formData.dropRouteId ||
          loadingDropBuses
        }
        isOptionEqualToValue={(option, value) =>
          option._id === value._id
        }
        getOptionLabel={(option) =>
          option?.busNumber
            ? `${option.busNumber}${
                option.vehicleNumber
                  ? ` (${option.vehicleNumber})`
                  : ""
              }`
            : ""
        }
        noOptionsText={
          formData.dropRouteId
            ? "No buses assigned to this route"
            : "Select drop route first"
        }
        renderInput={(params) =>
          autocompleteInputProps(
            params,
            loadingDropBuses ? (
              <CircularProgress size={18} />
            ) : (
              <DirectionsBusOutlined
                sx={{
                  color: formData.dropRouteId
                    ? "#7b8794"
                    : "#b5bdc9",
                  fontSize: 20,
                }}
              />
            ),
            formData.dropRouteId
              ? "Select drop bus"
              : "Select drop route first",
            errors.dropBusId,
            errors.dropBusId
          )
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option._id}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {option.busNumber}
              </Typography>

              {option.vehicleNumber && (
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#7b8794",
                    mt: 0.2,
                  }}
                >
                  Vehicle: {option.vehicleNumber}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      />

      {/* DROP STOP */}
      <Autocomplete
        fullWidth
        options={dropStops}
        value={selectedDropStop}
        onChange={handleDropStopChange}
        disabled={!formData.dropRouteId}
        isOptionEqualToValue={(option, value) =>
          option.stopName === value.stopName
        }
        getOptionLabel={(option) =>
          option?.stopName || ""
        }
        noOptionsText={
          formData.dropRouteId
            ? "No drop stops available"
            : "Select drop route first"
        }
        renderInput={(params) =>
          autocompleteInputProps(
            params,
            <LocationOnOutlined
              sx={{
                color: formData.dropRouteId
                  ? "#7b8794"
                  : "#b5bdc9",
                fontSize: 20,
              }}
            />,
            formData.dropRouteId
              ? "Select drop stop"
              : "Select drop route first",
            errors.dropStop,
            errors.dropStop
          )
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option._id || option.stopName}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LocationOnOutlined
              sx={{
                color: "#ed6c02",
                fontSize: 18,
              }}
            />

            <Typography
              sx={{
                fontSize: "14px",
              }}
            >
              {option.stopName}
            </Typography>
          </Box>
        )}
      />

    </Box>
  </Box>

</Paper>

        </Box>
      </DialogContent>


      {/* FOOTER */}
      <Divider />

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.7,
          backgroundColor: "#ffffff",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            color: "#8a94a6",
            display: { xs: "none", sm: "block" },
          }}
        >
          * Required fields
        </Typography>

        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
          <Button
            onClick={handleClose}
            disabled={saving}
            startIcon={<CloseOutlined />}
            sx={{
              px: 2,
              borderRadius: "9px",
              color: "#667085",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { backgroundColor: "#f3f5f8" },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <SaveOutlined />
              )
            }
            sx={{
              px: 2.5,
              borderRadius: "9px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 10px rgba(25,118,210,0.25)",
              "&:hover": { boxShadow: "0 6px 14px rgba(25,118,210,0.3)" },
            }}
          >
            {saving ? "Saving..." : "Save Student"}
          </Button>
        </Box>
      </DialogActions>

    </Dialog>
  );
};


export default AddStudentModal;
