import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  InputAdornment,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";

import PersonOutlined from "@mui/icons-material/PersonOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

import {
  updateDriver,
} from "../services/driver.service";


const EditDriverModal = ({
  open,
  handleClose,
  driver,
  refreshDrivers,
}) => {

  /*
   * =========================================================
   * INITIAL FORM
   * =========================================================
   */

  const initialFormData = {
    name: "",
    email: "",
    phone: "",
  };


  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [formData, setFormData] =
    useState(initialFormData);

  const [errors, setErrors] =
    useState({});

  const [saving, setSaving] =
    useState(false);


  /*
   * =========================================================
   * LOAD DRIVER DATA
   * =========================================================
   */

  useEffect(() => {

    if (driver) {

      setFormData({
        name: driver.name || "",
        email: driver.email || "",
        phone: driver.phone || "",
      });

      setErrors({});
    }

  }, [driver]);


  /*
   * =========================================================
   * RESET WHEN CLOSED
   * =========================================================
   */

  useEffect(() => {

    if (!open) {

      setErrors({});
      setSaving(false);

    }

  }, [open]);


  /*
   * =========================================================
   * HANDLE INPUT
   * =========================================================
   */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));


    /*
     * Remove field error when
     * user starts correcting it.
     */

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

  };


  /*
   * =========================================================
   * VALIDATION
   * =========================================================
   */

  const validateForm = () => {

    const newErrors = {};


    /*
     * NAME
     */

    if (!formData.name.trim()) {

      newErrors.name =
        "Driver name is required";

    } else if (
      formData.name.trim().length < 2
    ) {

      newErrors.name =
        "Please enter a valid name";

    }


    // EMAIL

      if (!formData.email.trim()) {

        newErrors.email =
          "Driver email is required";

      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email.trim()
        )
      ) {

        newErrors.email =
          "Enter a valid email address";

      }

    /*
     * PHONE
     */

    if (!formData.phone.trim()) {

      newErrors.phone =
        "Phone number is required";

    } else if (
      !/^[0-9]{10}$/.test(
        formData.phone.trim()
      )
    ) {

      newErrors.phone =
        "Enter a valid 10-digit phone number";

    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );

  };


  /*
   * =========================================================
   * UPDATE DRIVER
   * =========================================================
   */

  const handleSubmit = async () => {

    /*
     * Prevent double-click
     */

    if (saving) {
      return;
    }


    /*
     * Make sure driver exists
     */

    if (!driver?._id) {

      setErrors({
        submit:
          "Driver information is missing.",
      });

      return;

    }


    /*
     * Validate
     */

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }


    try {

      setSaving(true);


      /*
       * IMPORTANT:
       * Existing API functionality remains
       * exactly the same.
       */

      await updateDriver(
        driver._id,
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
        }
      );


      /*
       * Refresh driver list
       */

      if (refreshDrivers) {
        await refreshDrivers();
      }


      /*
       * Close modal
       */

      handleClose();

    } catch (error) {

      console.error(
        "Failed to update driver:",
        error
      );


      const message =
        error?.response?.data?.message ||
        "Failed to update driver";


      setErrors((previous) => ({
        ...previous,
        submit: message,
      }));

    } finally {

      setSaving(false);

    }

  };


  /*
   * =========================================================
   * COMMON TEXT FIELD STYLE
   * =========================================================
   */

  const fieldSx = {

    "& .MuiOutlinedInput-root": {

      minHeight: "48px",

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


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (

    <Dialog
      open={open}

      onClose={
        saving
          ? undefined
          : handleClose
      }

      fullWidth

      maxWidth="sm"

      /*
       * MUI 9 compatible
       */

      slotProps={{
        paper: {

          sx: {

            borderRadius: "16px",

            overflow: "hidden",

            boxShadow:
              "0 20px 60px rgba(0,0,0,0.18)",

            maxHeight: "92vh",

          },

        },
      }}

    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <DialogTitle
        sx={{

          px: {
            xs: 2,
            sm: 3,
          },

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

            justifyContent:
              "space-between",

          }}
        >

          {/* LEFT */}

          <Box
            sx={{

              display: "flex",

              alignItems: "center",

              gap: 1.5,

            }}
          >

            <Box
              sx={{

                width: 44,

                height: 44,

                borderRadius: "12px",

                backgroundColor:
                  "rgba(255,255,255,0.16)",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

              }}
            >

              <EditOutlined />

            </Box>


            <Box>

              <Typography
                sx={{

                  fontSize: {
                    xs: "18px",
                    sm: "20px",
                  },

                  fontWeight: 700,

                  lineHeight: 1.2,

                }}
              >
                Edit Driver
              </Typography>


              <Typography
                sx={{

                  fontSize: "12px",

                  opacity: 0.85,

                  mt: 0.4,

                }}
              >
                Update driver information
              </Typography>

            </Box>

          </Box>


          {/* CLOSE */}

          <IconButton
            onClick={handleClose}

            disabled={saving}

            sx={{

              width: 36,

              height: 36,

              borderRadius: "10px",

              color: "#ffffff",

              backgroundColor:
                "rgba(255,255,255,0.12)",

              "&:hover": {

                backgroundColor:
                  "rgba(255,255,255,0.22)",

              },

            }}
          >

            <CloseOutlined
              fontSize="small"
            />

          </IconButton>

        </Box>

      </DialogTitle>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <DialogContent
        sx={{

          p: {
            xs: 1.5,
            sm: 3,
          },

          backgroundColor:
            "#f7f9fc",

        }}
      >

        <Paper
          elevation={0}

          sx={{

            p: {
              xs: 1.8,
              sm: 2.5,
            },

            borderRadius: "14px",

            border:
              "1px solid #e5e9f0",

            backgroundColor:
              "#ffffff",

          }}
        >

          {/* =================================================
              SECTION TITLE
          ================================================== */}

          <Box
            sx={{

              display: "flex",

              alignItems: "center",

              gap: 1.5,

              mb: 2.5,

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

                backgroundColor:
                  "#eaf2ff",

                color: "#1976d2",

                flexShrink: 0,

              }}
            >

              <PersonOutlined
                fontSize="small"
              />

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
                Driver Information
              </Typography>


              <Typography
                sx={{

                  fontSize: "12px",

                  color: "#7a8499",

                  mt: 0.35,

                }}
              >
                Modify the driver's details
              </Typography>

            </Box>

          </Box>


          {/* =================================================
              FORM
          ================================================== */}

          <Box
            sx={{

              display: "flex",

              flexDirection: "column",

              gap: 2,

            }}
          >

            {/* =================================================
                NAME
            ================================================== */}

            <TextField
              fullWidth

              required

              label="Driver Name"

              name="name"

              value={
                formData.name
              }

              onChange={
                handleChange
              }

              placeholder="Enter driver's full name"

              size="small"

              error={
                Boolean(errors.name)
              }

              helperText={
                errors.name || ""
              }

              sx={fieldSx}

              slotProps={{
                input: {

                  startAdornment: (

                    <InputAdornment
                      position="start"
                    >

                      <PersonOutlined
                        sx={{

                          color:
                            "#7b8794",

                          fontSize: 20,

                        }}
                      />

                    </InputAdornment>

                  ),

                },
              }}

            />


            {/* =================================================
    EMAIL
================================================== */}

<TextField
  fullWidth
  required

  label="Email"

  name="email"

  value={
    formData.email
  }

  onChange={
    handleChange
  }

  placeholder="Enter driver's email address"

  type="email"

  size="small"

  error={
    Boolean(errors.email)
  }

  helperText={
    errors.email ||
    "Required for password recovery"
  }

  sx={fieldSx}

  slotProps={{
    input: {

      startAdornment: (
        <InputAdornment
          position="start"
        >

          <EmailOutlined
            sx={{
              color: "#7b8794",
              fontSize: 20,
            }}
          />

        </InputAdornment>
      ),

    },
  }}

/>


            {/* =================================================
                PHONE
            ================================================== */}

            <TextField
              fullWidth

              required

              label="Phone Number"

              name="phone"

              value={
                formData.phone
              }

              onChange={
                handleChange
              }

              placeholder="Enter 10-digit phone number"

              type="tel"

              size="small"

              error={
                Boolean(errors.phone)
              }

              helperText={
                errors.phone ||
                "Enter a valid 10-digit mobile number"
              }

              sx={fieldSx}

              slotProps={{
                input: {

                  startAdornment: (

                    <InputAdornment
                      position="start"
                    >

                      <PhoneOutlined
                        sx={{

                          color:
                            "#7b8794",

                          fontSize: 20,

                        }}
                      />

                    </InputAdornment>

                  ),

                  inputProps: {
                    maxLength: 10,
                  },

                },
              }}

            />

          </Box>


          {/* =================================================
              INFORMATION BOX
          ================================================== */}

          <Box
            sx={{

              mt: 2.5,

              p: 1.5,

              borderRadius: "10px",

              backgroundColor:
                "#f5f9ff",

              border:
                "1px solid #dceaff",

              display: "flex",

              alignItems: "flex-start",

              gap: 1,

            }}
          >

            <InfoOutlined
              sx={{

                color: "#1976d2",

                fontSize: 18,

                mt: "1px",

              }}
            />


            <Box>

              <Typography
                sx={{

                  fontSize: "12px",

                  fontWeight: 600,

                  color: "#344054",

                }}
              >
                Driver account
              </Typography>


              <Typography
                sx={{

                  fontSize: "12px",

                  color: "#667085",

                  lineHeight: 1.5,

                  mt: 0.2,

                }}
              >
                Updating the phone number
                will change the number used
                by the driver to access the
                application.
              </Typography>

            </Box>

          </Box>


          {/* =================================================
              BACKEND ERROR
          ================================================== */}

          {errors.submit && (

            <Box
              sx={{

                mt: 2,

                px: 1.5,

                py: 1.2,

                borderRadius: "9px",

                backgroundColor:
                  "#fff4f4",

                border:
                  "1px solid #ffcdd2",

              }}
            >

              <Typography
                sx={{

                  fontSize: "12px",

                  color: "#d32f2f",

                  fontWeight: 500,

                }}
              >

                {errors.submit}

              </Typography>

            </Box>

          )}

        </Paper>

      </DialogContent>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Divider />


      <DialogActions
        sx={{

          px: {
            xs: 2,
            sm: 3,
          },

          py: 1.7,

          backgroundColor:
            "#ffffff",

          justifyContent:
            "space-between",

        }}
      >

        <Typography
          sx={{

            fontSize: "11px",

            color: "#8a94a6",

            display: {
              xs: "none",
              sm: "block",
            },

          }}
        >
          * Required fields
        </Typography>


        <Box
          sx={{

            display: "flex",

            gap: 1,

            ml: "auto",

          }}
        >

          {/* =================================================
              CANCEL
          ================================================== */}

          <Button
            onClick={
              handleClose
            }

            disabled={saving}

            startIcon={
              <CloseOutlined />
            }

            sx={{

              px: 2,

              borderRadius: "9px",

              color: "#667085",

              fontWeight: 600,

              textTransform:
                "none",

              "&:hover": {

                backgroundColor:
                  "#f3f5f8",

              },

            }}
          >
            Cancel
          </Button>


          {/* =================================================
              UPDATE
          ================================================== */}

          <Button
            variant="contained"

            onClick={
              handleSubmit
            }

            disabled={saving}

            startIcon={

              saving ? (

                <CircularProgress
                  size={17}
                  color="inherit"
                />

              ) : (

                <SaveOutlined />

              )

            }

            sx={{

              px: 2.5,

              borderRadius: "9px",

              fontWeight: 600,

              textTransform:
                "none",

              boxShadow:
                "0 4px 10px rgba(25,118,210,0.25)",

              "&:hover": {

                boxShadow:
                  "0 6px 14px rgba(25,118,210,0.3)",

              },

            }}
          >

            {saving
              ? "Updating..."
              : "Update Driver"}

          </Button>

        </Box>

      </DialogActions>

    </Dialog>

  );
};


export default EditDriverModal;