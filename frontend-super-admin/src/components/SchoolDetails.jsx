import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Box,
  IconButton,
  Button,
  Chip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

// Subscription status -> chip color. Extend if you add more
// states on the backend (e.g. "Trial", "Cancelled").
const SUBSCRIPTION_STYLES = {
  Active: { bg: "#dcfce7", color: "#15803d" },
  Trial: { bg: "#fef3c7", color: "#b45309" },
  Expired: { bg: "#fee2e2", color: "#b91c1c" },
  Inactive: { bg: "#f1f5f9", color: "#64748b" },
};

// One labeled fact — icon, small gray label, bold value.
// Used for every field so Phone/Email/Address/Subscription
// all read consistently instead of a plain Divider stack.
function DetailItem({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        p: 1.75,
        borderRadius: "12px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: "9px",
          display: "grid",
          placeItems: "center",
          background: "#eff6ff",
          color: "#2563EB",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.4px" }}>
          {label.toUpperCase()}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a", mt: 0.25, wordBreak: "break-word" }}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function SchoolDetails({
  open,
  onClose,
  school,
}) {

  if (!school) return null;

  const subscriptionStyle =
    SUBSCRIPTION_STYLES[school.subscriptionStatus] || SUBSCRIPTION_STYLES.Inactive;

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: "18px", overflow: "hidden" },
      }}
    >

      {/* =====================================================
          HEADER — brand gradient band with a school icon
          badge, the school's name as the subtitle, and a
          close button. Replaces the plain DialogTitle.
      ===================================================== */}

      <Box
        sx={{
          background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
          color: "#fff",
          px: 3,
          py: 2.5,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "rgba(255,255,255,0.85)",
            "&:hover": { background: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <SchoolIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
              School Details
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, opacity: 0.9 }}>
              {school.schoolName || "Unnamed School"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>

        <Grid container spacing={2}>

          <Grid item xs={12}>
            <DetailItem
              icon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />}
              label="Address"
              value={school.address}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon={<PhoneOutlinedIcon sx={{ fontSize: 18 }} />}
              label="Phone"
              value={school.phone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />}
              label="Email"
              value={school.email}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.75,
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  borderRadius: "9px",
                  display: "grid",
                  placeItems: "center",
                  background: "#eff6ff",
                  color: "#2563EB",
                }}
              >
                <VerifiedOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.4px" }}>
                  SUBSCRIPTION
                </Typography>
              </Box>
              <Chip
                label={school.subscriptionStatus || "Inactive"}
                size="small"
                sx={{
                  bgcolor: subscriptionStyle.bg,
                  color: subscriptionStyle.color,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
            </Box>
          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: "1px solid #e2e8f0",
        }}
      >

        <Button
          onClick={onClose}
          sx={{
            color: "#64748b",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 2.5,
          }}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>

  );

}
