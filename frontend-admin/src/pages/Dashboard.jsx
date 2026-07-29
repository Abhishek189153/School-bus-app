import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Paper,
  Button,
  Grid,
} from "@mui/material";

import {
  School,
  DirectionsBus,
  Person,
  Route,
  Groups,
  CheckCircleOutlined,
  AirlineSeatReclineNormal,
  WarningAmber,
  PersonOff,
  CancelOutlined,
  Add,
  TrendingUp,
} from "@mui/icons-material";

import AddIcon from "@mui/icons-material/Add";

import CircularProgress from "@mui/material/CircularProgress";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { getDashboardStats } from "../services/dashboard.service";
import WorkingDaysCard from "../components/WorkingDaysCard";
import AddStudentModal from "../components/AddStudentModal";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

   const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
  fetchStats();

  const interval = setInterval(() => {
    fetchStats();
  }, 10000); // Refresh every 10 seconds

  return () => clearInterval(interval);
}, []);

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
        <DirectionsBusIcon sx={{ fontSize: 70, color: "#1976D2" }} />
        <CircularProgress size={50} />
        <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  // Percentage Calculations
  const studentAssignmentPct = stats?.students
    ? Math.round(((stats?.studentsAssigned ?? 0) / stats.students) * 100)
    : 0;

  const busActivePct = stats?.buses
    ? Math.round(((stats?.activeBuses ?? 0) / stats.buses) * 100)
    : 0;

  const driverActivePct = stats?.drivers
    ? Math.round(((stats?.driversAssigned ?? 0) / stats.drivers) * 100)
    : 0;

  // Chart Data Array
  const efficiencyMetrics = [
    {
      label: "Students",
      pct: studentAssignmentPct,
      color: "#6366F1",
    },
    {
      label: "Buses",
      pct: busActivePct,
      color: "#0EA5E9",
    },
    {
      label: "Drivers",
      pct: driverActivePct,
      color: "#10B981",
    },
  ];

  const statCards = [
    {
      title: "Students",
      value: stats?.students ?? 0,
      path: "/students",
      icon: <School sx={{ fontSize: 22 }} />,
      gradient: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
      glow: "rgba(99, 102, 241, 0.25)",
    },
    {
      title: "Drivers",
      value: stats?.drivers ?? 0,
      path: "/drivers",
      icon: <Person sx={{ fontSize: 22 }} />,
      gradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
      glow: "rgba(16, 185, 129, 0.25)",
    },
    {
      title: "Parents",
      value: stats?.parents ?? 0,
      path: "/parents",
      icon: <Groups sx={{ fontSize: 22 }} />,
      gradient: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
      glow: "rgba(249, 115, 22, 0.25)",
    },
    {
      title: "Buses",
      value: stats?.buses ?? 0,
      path: "/buses",
      icon: <DirectionsBus sx={{ fontSize: 22 }} />,
      gradient: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)",
      glow: "rgba(14, 165, 233, 0.25)",
    },
    {
      title: "Routes",
      value: stats?.routes ?? 0,
      path: "/routes",
      icon: <Route sx={{ fontSize: 22 }} />,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
      glow: "rgba(245, 158, 11, 0.25)",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: "1550px",
        mx: "auto",
        background: "linear-gradient(180deg,#F8FAFC 0%,#F1F5F9 100%)",
        minHeight: "100vh",
      }}
    >
     {/* ==================== Top Header ==================== */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: {
      xs: "flex-start",
      lg: "center",
    },
    flexWrap: "wrap",
    gap: 3,
    mb: 4,
  }}
>
  {/* Left Side */}
  <Box
    sx={{
      flex: 1,
      minWidth: 320,
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontWeight: 800,
        mb: 1,
      }}
    >
      Welcome Back, Admin
    </Typography>

    <Typography
      sx={{
        color: "#64748B",
      }}
    >
      Here is what's happening with your school transportation network today.
    </Typography>
  </Box>

  {/* Right Side */}
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-end",
      gap: 3,
      flexWrap: {
        xs: "wrap",
        lg: "nowrap",
      },
    }}
  >
   <Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={() => setOpen(true)}
  sx={{
    px: 7,
    height: 52,
    borderRadius: 3,
    textTransform: "none",
    fontWeight: 700,
    whiteSpace: "nowrap",
    flexShrink: 0,
    mr: {
      xs: 0,
      md: 4,
      lg: 10,
      xl: 10,
    },
  }}
>
  Add Student
</Button>

    <Box
      sx={{
        width: {
          xs: "100%",
          sm: 340,
          md: 350,
        },
        maxWidth: 350,
      }}
    >
      <WorkingDaysCard />
    </Box>
  </Box>
</Box>
{/* </Grid> */}

      {/* Main Top Grid (5 Stat Cards Left + System Efficiency Graph Right) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 360px",
          },
          gap: 2,
          mb: 4,
          alignItems: "stretch", // Ensures both columns match height naturally
        }}
      >
        {/* Left: 5 Stat Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(5, 1fr)",
            },
            gap: 1.5,
            height: "100%",
            alignItems: "flex-end",
          }}
        >

          <Paper
  elevation={0}
  sx={{
    gridColumn: {
      xs: "1 / -1",
      sm: "1 / -1",
      md: "1 / -1",
    },
    p: 1.5,
    borderRadius: "20px",
    background: "#fff",
    border: "1px solid #E2E8F0",
    boxShadow: "0 10px 25px rgba(15,23,42,.05)",
  }}
>
  <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
    Today's Attendance
  </Typography>

  <Typography
    sx={{
      color: "#64748B",
      fontSize: ".85rem",
      mb: 1,
    }}
  >
   {/* <Typography
  sx={{
    color: "#64748B",
    fontSize: ".85rem",
    mb: 1,
  }}
> */}
  {stats?.attendance?.present ?? 0} / {stats?.attendance?.total ?? 0} Students Present
</Typography>
  {/* </Typography> */}

  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Box
      sx={{
        flex: 1,
        height: 12,
        bgcolor: "#E2E8F0",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${stats?.attendance?.percentage ?? 0}%`,
          height: "100%",
          bgcolor: "#10B981",
          borderRadius: 10,
        }}
      />
    </Box>

    <Typography
      sx={{
        fontWeight: 800,
        color: "#10B981",
      }}
    >
     {stats?.attendance?.percentage ?? 0}%
    </Typography>
  </Box>
</Paper>

          {statCards.map((card) => (
            <Card
              key={card.title}
              onClick={() => navigate(card.path)}
              elevation={0}
              sx={{
                cursor: "pointer",
                borderRadius: "22px",
                background: card.gradient,
                color: "#fff",
                height: 210, // Reduced height for smaller upper cards
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 12px 24px ${card.glow}`,
                transition: "all .35s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -25,
                  right: -25,
                  width: 85,
                  height: 85,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.12)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  height: 240,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:last-child": { pb: 2 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "14px",
                      bgcolor: "rgba(255,255,255,.2)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <ArrowForwardIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                </Box>

                <Box sx={{ mt: "auto" }}>
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {card.value}
                  </Typography>

                  <Typography
                    noWrap
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      opacity: 0.95,
                    }}
                  >
                    Total {card.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Right: System Efficiency Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2.2,
            height: 300, // Exactly matches stat card height (190px)
            borderRadius: "22px",
            background: "linear-gradient(135deg,#0F172A,#1E293B)",
            color: "#fff",
            boxShadow: "0 15px 30px rgba(15,23,42,.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                System Efficiency
              </Typography>
              <Typography sx={{ color: "#94A3B8", fontSize: ".78rem" }}>
                Real Time Performance
              </Typography>
            </Box>
            <TrendingUp sx={{ color: "#10B981", fontSize: 26 }} />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              pt: 1,
            }}
          >
            {efficiencyMetrics.map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    mb: 0.5,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  {item.pct}%
                </Typography>

                <Box
                  sx={{
                    width: 48,
                    height: `${Math.max(item.pct * 1.8, 36)}px`,
                    maxHeight: 150,
                    borderRadius: "10px 10px 0 0",
                    background: `linear-gradient(180deg, ${item.color}, ${item.color}CC)`,
                    boxShadow: `0 8px 16px ${item.color}44`,
                    transition: "all .5s ease",
                  }}
                />

                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#94A3B8",
                    fontWeight: 600,
                    fontSize: ".72rem",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Fleet & Allocation Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: "22px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0 10px 30px rgba(15,23,42,.04)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              Fleet & Allocation Overview
            </Typography>
            <Typography sx={{ color: "#64748B", fontSize: ".82rem" }}>
              Live transportation resource summary
            </Typography>
          </Box>

          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: "999px",
              backgroundColor: "#ECFDF5",
              color: "#059669",
              fontWeight: 700,
              fontSize: ".78rem",
            }}
          >
            ● Live Sync
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(6, 1fr)",
            },
            gap: 1.8,
          }}
        >
          {/* Assigned Students */}
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
              border: "1px solid #BBF7D0",
            }}
          >
            <CheckCircleOutlined
              sx={{ color: "#16A34A", fontSize: 26, mb: 1 }}
            />
            <Typography
              sx={{ color: "#166534", fontWeight: 700, fontSize: "0.82rem" }}
            >
              Assigned Students
            </Typography>
            <Typography
              sx={{
                fontSize: "2.1rem",
                fontWeight: 800,
                color: "#14532D",
                my: 0.3,
              }}
            >
              {stats?.studentsAssigned ?? 0}
            </Typography>
            <Typography
              variant="caption"
              color="#15803D"
              sx={{ fontWeight: 500 }}
            >
              {studentAssignmentPct}% of overall
            </Typography>
          </Box>

          {/* Assigned Drivers */}
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
              border: "1px solid #BFDBFE",
            }}
          >
            <AirlineSeatReclineNormal
              sx={{ color: "#2563EB", fontSize: 26, mb: 1 }}
            />
            <Typography
              sx={{ color: "#1E40AF", fontWeight: 700, fontSize: "0.82rem" }}
            >
              Assigned Drivers
            </Typography>
            <Typography
              sx={{
                fontSize: "2.1rem",
                fontWeight: 800,
                color: "#1E3A8A",
                my: 0.3,
              }}
            >
              {stats?.driversAssigned ?? 0}
            </Typography>
            <Typography
              variant="caption"
              color="#1D4ED8"
              sx={{ fontWeight: 500 }}
            >
              Active drivers
            </Typography>
          </Box>

          {/* Active Buses */}
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              background: "linear-gradient(135deg,#ECFEFF,#CFFAFE)",
              border: "1px solid #A5F3FC",
            }}
          >
            <DirectionsBus sx={{ color: "#0891B2", fontSize: 26, mb: 1 }} />
            <Typography
              sx={{ color: "#155E75", fontWeight: 700, fontSize: "0.82rem" }}
            >
              Active Buses
            </Typography>
            <Typography
              sx={{
                fontSize: "2.1rem",
                fontWeight: 800,
                color: "#164E63",
                my: 0.3,
              }}
            >
              {stats?.activeBuses ?? 0}
            </Typography>
            <Typography
              variant="caption"
              color="#0E7490"
              sx={{ fontWeight: 500 }}
            >
              {busActivePct}% operational
            </Typography>
          </Box>

          {/* Unassigned Students */}
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)",
              border: "1px solid #FDE68A",
            }}
          >
            <WarningAmber sx={{ color: "#D97706", fontSize: 26, mb: 1 }} />
            <Typography
              sx={{ color: "#92400E", fontWeight: 700, fontSize: "0.82rem" }}
            >
              Unassigned Students
            </Typography>
            <Typography
              sx={{
                fontSize: "2.1rem",
                fontWeight: 800,
                color: "#78350F",
                my: 0.3,
              }}
            >
              {stats?.studentsUnassigned ?? 0}
            </Typography>
            <Typography
              variant="caption"
              color="#B45309"
              sx={{ fontWeight: 500 }}
            >
              Pending allocation
            </Typography>
          </Box>

          {/* Unassigned Drivers */}
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              background: "linear-gradient(135deg,#FEF2F2,#FEE2E2)",
              border: "1px solid #FECACA",
            }}
          >
            <PersonOff sx={{ color: "#DC2626", fontSize: 26, mb: 1 }} />
            <Typography
              sx={{ color: "#991B1B", fontWeight: 700, fontSize: "0.82rem" }}
            >
              Unassigned Drivers
            </Typography>
            <Typography
              sx={{
                fontSize: "2.1rem",
                fontWeight: 800,
                color: "#7F1D1D",
                my: 0.3,
              }}
            >
              {stats?.driversUnassigned ?? 0}
            </Typography>
            <Typography
              variant="caption"
              color="#B91C1C"
              sx={{ fontWeight: 500 }}
            >
              Available driver's
            </Typography>
          </Box>

          {/* Inactive Buses */}
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              background: "linear-gradient(135deg,#F8FAFC,#E2E8F0)",
              border: "1px solid #CBD5E1",
            }}
          >
            <CancelOutlined sx={{ color: "#475569", fontSize: 26, mb: 1 }} />
            <Typography
              sx={{ color: "#334155", fontWeight: 700, fontSize: "0.82rem" }}
            >
              Inactive Buses
            </Typography>
            <Typography
              sx={{
                fontSize: "2.1rem",
                fontWeight: 800,
                color: "#0F172A",
                my: 0.3,
              }}
            >
              {stats?.inactiveBuses ?? 0}
            </Typography>
            <Typography
              variant="caption"
              color="#475569"
              sx={{ fontWeight: 500 }}
            >
              Maintenance / Depot
            </Typography>
          </Box>
        </Box>
      </Paper>
      <AddStudentModal
  open={open}
  handleClose={() => setOpen(false)}
  refreshStudents={fetchStats}
/>
    </Box>
  );
};

export default Dashboard;