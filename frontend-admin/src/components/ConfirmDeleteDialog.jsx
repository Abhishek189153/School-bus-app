import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  useState,
} from "react";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

/**
 * Shared delete-confirmation dialog — use this everywhere instead of
 * window.confirm(...). One component, reused by Students, Parents,
 * Drivers, Buses, Routes, etc.
 *
 * Props:
 *  - open          : boolean
 *  - onClose       : () => void            (Cancel / backdrop / Esc)
 *  - onConfirm     : () => void | Promise   (called on Delete click)
 *  - entityLabel   : string, e.g. "student", "driver", "bus", "route"
 *  - itemName      : optional string to name the specific record,
 *                     e.g. the student's name or the bus number
 */
export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  entityLabel = "item",
  itemName,
}) {

  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return; // don't let it close mid-delete
    onClose();
  };

  // onConfirm may be async (an axios.delete call) — await it here so
  // the button can show a spinner and the dialog can't be
  // double-submitted. Callers should keep their own error handling
  // (try/catch + alert/toast) inside the onConfirm they pass in.
  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "18px", overflow: "hidden" },
      }}
    >

      <Box sx={{ px: 3, pt: 3.5, pb: 1, textAlign: "center" }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: "#fee2e2",
            color: "#dc2626",
            mx: "auto",
            mb: 1.5,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 26 }} />
        </Box>

        <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
          Delete this {entityLabel}?
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pb: 1 }}>

        <Typography sx={{ textAlign: "center", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>

          {itemName ? (
            <>
              Are you sure you want to delete{" "}
              <Box component="span" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {itemName}
              </Box>
              ? This action cannot be undone.
            </>
          ) : (
            <>This action cannot be undone.</>
          )}

        </Typography>

      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          gap: 1.5,
        }}
      >

        <Button
          fullWidth
          onClick={handleClose}
          disabled={submitting}
          sx={{
            color: "#64748b",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            py: 1,
          }}
        >
          Cancel
        </Button>

        <Button
          fullWidth
          color="error"
          variant="contained"
          onClick={handleConfirm}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : null}
          sx={{
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            py: 1,
            boxShadow: "0 4px 12px rgba(220,38,38,0.25)",

            "&:hover": {
              boxShadow: "0 6px 16px rgba(220,38,38,0.32)",
            },
          }}
        >
          {submitting ? "Deleting..." : "Delete"}
        </Button>

      </DialogActions>

    </Dialog>

  );

}
