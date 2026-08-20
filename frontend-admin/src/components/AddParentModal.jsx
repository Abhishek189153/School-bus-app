import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { createParent } from "../services/parent.service";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const AddParentModal = ({
  open,
  handleClose,
  refreshParents,
}) => {

  const [formData, setFormData] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [serverError, setServerError] =
    useState("");


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "email"
          ? value.toLowerCase()
          : value,
    }));

    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

    }

  };


  // ==========================================
  // VALIDATION
  // ==========================================

  const validate = () => {

    const next = {};


    // Name

    if (
      !formData.name.trim()
    ) {

      next.name =
        "Enter the parent's name";

    }


    // Email

    if (
      !formData.email.trim()
    ) {

      next.email =
        "Enter the parent's email";

    }
    else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {

      next.email =
        "Enter a valid email address";

    }


    // Phone

    if (
      !/^\d{10}$/.test(
        formData.phone.trim()
      )
    ) {

      next.phone =
        "Enter a valid 10-digit phone number";

    }


    // Password

    if (
      formData.password.length < 6
    ) {

      next.password =
        "Password must be at least 6 characters";

    }


    setErrors(next);

    return (
      Object.keys(next).length === 0
    );

  };


  // ==========================================
  // RESET
  // ==========================================

  const resetAndClose = () => {

    setFormData(
      initialForm
    );

    setErrors({});

    setServerError("");

    setShowPassword(false);

    handleClose();

  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async () => {

    if (!validate())
      return;

    setSubmitting(true);

    setServerError("");

    try {

      await createParent(
        formData
      );

      refreshParents();

      resetAndClose();

    } catch (error) {

      setServerError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );

    } finally {

      setSubmitting(false);

    }

  };


  return (

    <Dialog
      open={open}
      onClose={
        submitting
          ? undefined
          : resetAndClose
      }
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >

        <Avatar
          sx={{
            bgcolor:
              "rgba(255,255,255,0.2)",
            color: "inherit",
          }}
        >
          <PersonAddAltRoundedIcon />
        </Avatar>

        <Box>

          <DialogTitle
            sx={{
              p: 0,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Add Parent
          </DialogTitle>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.85,
            }}
          >
            Create a login for a parent to
            track their child's bus
          </Typography>

        </Box>

      </Box>


      <DialogContent
        sx={{
          pt: 3,
          pb: 1,
        }}
      >

        {serverError && (

          <Alert
            severity="error"
            sx={{
              mb: 2,
            }}
          >
            {serverError}
          </Alert>

        )}


        {/* ==================================
            NAME
        ================================== */}

        <TextField
          fullWidth
          autoFocus
          label="Name"
          name="name"
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
              >
                <PersonRoundedIcon
                  fontSize="small"
                  color="action"
                />
              </InputAdornment>
            ),
          }}
        />


        {/* ==================================
            EMAIL
        ================================== */}

        <TextField
          fullWidth
          type="email"
          label="Email"
          name="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={
            errors.email ||
            "Required for password recovery"
          }
          autoComplete="email"
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
              >
                <EmailRoundedIcon
                  fontSize="small"
                  color="action"
                />
              </InputAdornment>
            ),
          }}
        />


        {/* ==================================
            PHONE
        ================================== */}

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={
            errors.phone ||
            "10-digit mobile number"
          }
          inputProps={{
            maxLength: 10,
            inputMode: "numeric",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
              >
                <PhoneRoundedIcon
                  fontSize="small"
                  color="action"
                />
              </InputAdornment>
            ),
          }}
        />


        {/* ==================================
            PASSWORD
        ================================== */}

        <TextField
          fullWidth
          type={
            showPassword
              ? "text"
              : "password"
          }
          label="Password"
          name="password"
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={
            errors.password ||
            "At least 6 characters"
          }
          slotProps={{
            input: {

              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <LockRoundedIcon
                    fontSize="small"
                    color="action"
                  />
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment
                  position="end"
                >

                  <IconButton
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    edge="end"
                    size="small"
                  >

                    {showPassword ? (

                      <VisibilityOffRoundedIcon
                        fontSize="small"
                      />

                    ) : (

                      <VisibilityRoundedIcon
                        fontSize="small"
                      />

                    )}

                  </IconButton>

                </InputAdornment>
              ),

            },
          }}
        />

      </DialogContent>


      {/* ======================================
          ACTIONS
      ====================================== */}

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
        }}
      >

        <Button
          onClick={resetAndClose}
          disabled={submitting}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={
            submitting ? (
              <CircularProgress
                size={16}
                color="inherit"
              />
            ) : (
              <PersonAddAltRoundedIcon />
            )
          }
          sx={{
            borderRadius: 2,
            px: 3,
          }}
        >
          {submitting
            ? "Saving..."
            : "Save"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default AddParentModal;