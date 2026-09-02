import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  IconButton,
  Chip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SchoolIcon from "@mui/icons-material/School";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

// One labeled fact — icon, small gray label, bold value.
// Same pattern used in SchoolDetails, so every "view" dialog
// in the app reads consistently.
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

export default function SchoolAdminDetails({

  open,

  admin,

  onClose,

}) {

  if (!admin) return null;

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
          HEADER — brand gradient band with an admin icon
          badge, the admin's name as the subtitle, and a
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
            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px" }}>
              School Admin Details
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, opacity: 0.9 }}>
              {admin.name || "Unnamed Admin"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>

        <Grid container spacing={2}>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon={<PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />}
              label="Name"
              value={admin.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon={<SchoolIcon sx={{ fontSize: 18 }} />}
              label="School"
              value={admin.schoolId?.schoolName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon={<PhoneOutlinedIcon sx={{ fontSize: 18 }} />}
              label="Phone"
              value={admin.phone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />}
              label="Email"
              value={admin.email}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon={<EventOutlinedIcon sx={{ fontSize: 18 }} />}
              label="Created"
              value={
                admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString()
                  : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.75,
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                height: "100%",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.4px" }}>
                  ACCOUNT STATUS
                </Typography>
              </Box>
              <Chip
                label={admin.isFirstLogin ? "Pending Setup" : "Active"}
                color={admin.isFirstLogin ? "warning" : "success"}
                size="small"
                sx={{ fontWeight: 700, fontSize: 12 }}
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
