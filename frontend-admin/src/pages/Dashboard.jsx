import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Avatar,
  Paper,
  Button,
  Stack,
  Tooltip,
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
  ArrowForward,
  Add,
  TrendingUp,
} from "@mui/icons-material";

import CircularProgress from "@mui/material/CircularProgress";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { getDashboardStats } from "../services/dashboard.service";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchStats();
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
      <DirectionsBusIcon
        sx={{
          fontSize: 70,
          color: "#1976D2",
        }}
      />

      <CircularProgress size={50} />

      <Typography
        sx={{
          color: "#64748B",
          fontWeight: 600,
        }}
      >
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
      countText: `${stats?.studentsAssigned ?? 0} / ${stats?.students ?? 0} Assigned`,
    },
    {
      label: "Buses",
      pct: busActivePct,
      color: "#0EA5E9",
      countText: `${stats?.activeBuses ?? 0} / ${stats?.buses ?? 0} Active`,
    },
    {
      label: "Drivers",
      pct: driverActivePct,
      color: "#10B981",
      countText: `${stats?.driversAssigned ?? 0} / ${stats?.drivers ?? 0} Assigned`,
    },
  ];

  const statCards = [
    {
      title: "Students",
      value: stats?.students ?? 0,
      path: "/students",
      icon: <School sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
      glow: "rgba(99, 102, 241, 0.3)",
    },
    {
      title: "Drivers",
      value: stats?.drivers ?? 0,
      path: "/drivers",
      icon: <Person sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
      glow: "rgba(16, 185, 129, 0.3)",
    },
    {
      title: "Parents",
      value: stats?.parents ?? 0,
      path: "/parents",
      icon: <Groups sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
      glow: "rgba(249, 115, 22, 0.3)",
    },
    {
      title: "Buses",
      value: stats?.buses ?? 0,
      path: "/buses",
      icon: <DirectionsBus sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)",
      glow: "rgba(14, 165, 233, 0.3)",
    },
    {
      title: "Routes",
      value: stats?.routes ?? 0,
      path: "/routes",
      icon: <Route sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
      glow: "rgba(245, 158, 11, 0.3)",
    },
  ];

  return (
    <Box
  sx={{
   p: { xs: 3, md: 4 },
maxWidth: "1450px",
mx: "auto",
    background:
      "linear-gradient(180deg,#F8FAFC 0%,#F1F5F9 100%)",
    minHeight: "100vh",
  }}
>
      {/* Top Header */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center",gap:6, mb: 3 }}>
        <Box>
         <Typography
  sx={{
    fontSize: {
      xs: "1.8rem",
      md: "2.2rem",
    },
    fontWeight: 800,
    color: "#0F172A",
    letterSpacing: "-0.8px",
  }}
>
            Welcome Back, Admin
          </Typography>
          <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
            Here is what's happening with your school transportation network today.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/students")}
          sx={{
            borderRadius: "12px",
            px: 4.5,
            py: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
            backgroundColor: "#6366F1",
            "&:hover": { backgroundColor: "#4F46E5" },
          }}
        >
          Add Student
        </Button>
      </Box>

      
     
     {/* Main Top Grid */}
<Grid
  container
  spacing={8}
  sx={{
    mb: 5,
    alignItems: "stretch",
  }}
>
  {/* Statistics Cards */}
  <Grid item xs={12} lg={8}>
    <Grid container spacing={3.8}>
      {statCards.map((card) => (
       <Grid
  item
  xs={12}
  sm={6}
  md={4}
  key={card.title}
  sx={{
    flex: 1,
    minWidth: 160,
  }}
>
          <Card
            onClick={() => navigate(card.path)}
            elevation={0}
            sx={{
              cursor: "pointer",
              borderRadius: "28px",
              background: card.gradient,
              color: "#fff",
              height: 220,
              overflow: "hidden",
              position: "relative",
              boxShadow: `0 20px 40px ${card.glow}`,
              transition: "all .35s ease",

              "&:hover": {
                transform: "translateY(-10px)",
              },

              "&::before": {
                content: '""',
                position: "absolute",
                top: -40,
                right: -40,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: "rgba(255,255,255,.12)",
              },

              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: "rgba(255,255,255,.08)",
              },
            }}
          >
            <CardContent
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "space-between",
                // overflow: "visible",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Avatar
                  sx={{
                    width: 68,
                    height: 68,
                    borderRadius: "20px",
                    bgcolor: "rgba(255,255,255,.18)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {card.icon}
                </Avatar>

                <ArrowForward
                  sx={{
                    fontSize: 22,
                    opacity: .8,
                  }}
                />
              </Box>

             <Box
  sx={{
    mt: 5,
  }}
>
  <Typography
    sx={{
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1,
      mb: 1,
    }}
  >
    {card.value}
  </Typography>

  <Typography
    sx={{
      fontSize: "0.90rem",
      fontWeight: 600,
      opacity: 0.95,
    }}
  >
    Total {card.title}
  </Typography>
</Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Grid>

  {/* Premium Analytics Card */}
  <Grid item xs={12} lg={4}>
   <Paper
  elevation={0}
  sx={{
    height: 300,
    maxWidth: 420,
    width: "150%",
   alignSelf: "flex-start",
    mt: -13,
    ml: "auto",

    p: 3,
    borderRadius: "28px",
    background:
      "linear-gradient(135deg,#0F172A,#1E293B)",
    color: "#fff",
    boxShadow:
      "0 25px 50px rgba(15,23,42,.25)",
  }}
>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: -1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            System Efficiency
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: ".85rem",
            }}
          >
            Real Time Performance
          </Typography>
        </Box>

        <TrendingUp
          sx={{
            color: "#10B981",
            fontSize: 40,
            
          }}
        />
      </Box>

      {/* <Typography
        sx={{
          fontSize: "2rem",
          fontWeight: 800,
          mb: 3,
        }}
      >
        {Math.round(
          (
            studentAssignmentPct +
            busActivePct +
            driverActivePct
          ) / 3
        )}
        %
      </Typography> */}

      <Box
        sx={{
          height: 260,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-evenly",
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
                mb: 1,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {item.pct}%
            </Typography>

            <Box
              sx={{
                width: 65,
                minHeight: 50,
               height: `${Math.max(item.pct * 1.8, 35)}px`,
                borderRadius: "16px 16px 0 0",
                background: `linear-gradient(
                  180deg,
                  ${item.color},
                  ${item.color}CC
                )`,
                boxShadow: `0 12px 24px ${item.color}66`,
                transition: "all .5s ease",
              }}
            />

           <Typography
  sx={{
    mt:1,
    color: "#f3f6f9",
    fontWeight: 600,
    fontSize: ".81rem",
    textAlign: "center",
    width: 80,
  }}
>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  </Grid>
</Grid>

{/* Fleet & Allocation Section */}
<Paper
  elevation={0}
  sx={{
    p: 4,
    borderRadius: "28px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    boxShadow:
      "0 20px 50px rgba(15,23,42,.06)",
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 4,
    }}
  >
    <Box>
      <Typography
        sx={{
          fontSize: "1.35rem",
          fontWeight: 800,
          color: "#0F172A",
        }}
      >
        Fleet & Allocation Overview
      </Typography>

      <Typography
        sx={{
          color: "#64748B",
          fontSize: ".9rem",
        }}
      >
        Live transportation resource summary
      </Typography>
    </Box>

    <Box
      sx={{
        px: 2,
        py: 1,
        borderRadius: "999px",
        backgroundColor: "#ECFDF5",
        color: "#059669",
        fontWeight: 700,
        fontSize: ".85rem",
      }}
    >
      ● Live Sync
    </Box>
  </Box>

  <Grid container spacing={3}>
    {/* Assigned Students */}
    <Grid item xs={12} sm={6} md={4} lg={2}>
      <Box
        sx={{
          p: 3,
        height: 200,
        width: "80%",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
          border: "1px solid #BBF7D0",
        }}
      >
        <CheckCircleOutlined
          sx={{
            color: "#16A34A",
            fontSize: 34,
            mb: 2,
          }}
        />

        <Typography
          sx={{
            color: "#166534",
            fontWeight: 700,
          }}
        >
          Assigned Students
        </Typography>

        <Typography
          sx={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#14532D",
            my: 1,
          }}
        >
          {stats?.studentsAssigned ?? 0}
        </Typography>

        <Typography color="#15803D">
          {studentAssignmentPct}% of overall
        </Typography>
      </Box>
    </Grid>

    {/* Assigned Drivers */}
    <Grid item xs={12} sm={6} md={4} lg={2}>
      <Box
        sx={{
          p: 3,
          height: 200,
        width: "80%",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
          border: "1px solid #BFDBFE",
        }}
      >
        <AirlineSeatReclineNormal
          sx={{
            color: "#2563EB",
            fontSize: 34,
            mb: 2,
          }}
        />

        <Typography
          sx={{
            color: "#1E40AF",
            fontWeight: 700,
          }}
        >
          Assigned Drivers
        </Typography>

        <Typography
          sx={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#1E3A8A",
            my: 1,
          }}
        >
          {stats?.driversAssigned ?? 0}
        </Typography>

        <Typography color="#1D4ED8">
          Active drivers
        </Typography>
      </Box>
    </Grid>

    {/* Active Buses */}
    <Grid item xs={12} sm={6} md={4} lg={2}>
      <Box
        sx={{
          p: 3,
          height: 200,
        width: "80%",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg,#ECFEFF,#CFFAFE)",
          border: "1px solid #A5F3FC",
        }}
      >
        <DirectionsBus
          sx={{
            color: "#0891B2",
            fontSize: 34,
            mb: 2,
          }}
        />

        <Typography
          sx={{
            color: "#155E75",
            fontWeight: 700,
          }}
        >
          Active Buses
        </Typography>

        <Typography
          sx={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#164E63",
            my: 1,
          }}
        >
          {stats?.activeBuses ?? 0}
        </Typography>

        <Typography color="#0E7490">
          {busActivePct}% operational
        </Typography>
      </Box>
    </Grid>

    {/* Unassigned Students */}
    <Grid item xs={12} sm={6} md={4} lg={2}>
      <Box
        sx={{
          p: 3,
          height: 200,
        width: "80%",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg,#FFFBEB,#FEF3C7)",
          border: "1px solid #FDE68A",
        }}
      >
        <WarningAmber
          sx={{
            color: "#D97706",
            fontSize: 34,
            mb: 2,
          }}
        />

        <Typography
          sx={{
            color: "#92400E",
            fontWeight: 700,
          }}
        >
          Unassigned Students
        </Typography>

        <Typography
          sx={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#78350F",
            my: 1,
          }}
        >
          {stats?.studentsUnassigned ?? 0}
        </Typography>

        <Typography color="#B45309">
          Pending allocation
        </Typography>
      </Box>
    </Grid>

    {/* Unassigned Drivers */}
    <Grid item xs={12} sm={6} md={4} lg={2}>
      <Box
        sx={{
          p: 3,
          height: 200,
        width: "80%",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg,#FEF2F2,#FEE2E2)",
          border: "1px solid #FECACA",
        }}
      >
        <PersonOff
          sx={{
            color: "#DC2626",
            fontSize: 34,
            mb: 2,
          }}
        />

        <Typography
          sx={{
            color: "#991B1B",
            fontWeight: 700,
          }}
        >
          Unassigned Drivers
        </Typography>

        <Typography
          sx={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#7F1D1D",
            my: 1,
          }}
        >
          {stats?.driversUnassigned ?? 0}
        </Typography>

        <Typography color="#B91C1C">
          Available driver's
        </Typography>
      </Box>
    </Grid>

    {/* Inactive Buses */}
    <Grid item xs={12} sm={6} md={4} lg={2}>
      <Box
        sx={{
          p: 3,
          height: 200,
        width: "80%",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg,#F8FAFC,#E2E8F0)",
          border: "1px solid #CBD5E1",
        }}
      >
        <CancelOutlined
          sx={{
            color: "#475569",
            fontSize: 34,
            mb: 2,
          }}
        />

        <Typography
          sx={{
            color: "#334155",
            fontWeight: 700,
          }}
        >
          Inactive Buses
        </Typography>

        <Typography
          sx={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#0F172A",
            my: 1,
          }}
        >
          {stats?.inactiveBuses ?? 0}
        </Typography>

        <Typography color="#475569">
          Maintenance / Depot
        </Typography>
      </Box>
    </Grid>
  </Grid>
</Paper>



</Box>
);
};

export default Dashboard;