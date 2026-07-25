import {
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard.service";

import SchoolIcon from "@mui/icons-material/School";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

import StatCard from "../components/StatCard";
import PageContainer from "../components/PageContainer";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalSchools: 0,
    totalAdmins: 0,
    totalStudents: 0,
    totalBuses: 0,
    recentSchools: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer>
      {/* Top Banner Row */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: { xs: 4, md: 5 },
          background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
          color: "#fff",
          mb: 4,
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.15)",
        }}
      >
        <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: "-0.5px" }}>
          Welcome {JSON.parse(sessionStorage.getItem("user"))?.name}
        </Typography>

        <Typography
          mt={1}
          sx={{
            opacity: 0.9,
            fontSize: "15px",
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          Manage all schools, buses, parents and school administrators from one central dashboard view.
        </Typography>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            mt: 3.5,
            background: "#fff",
            color: "#2563EB",
            fontWeight: "700",
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            py: 1,
            boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
            "&:hover": {
              background: "#f8fafc",
              boxShadow: "0 6px 16px rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          Add School
        </Button>
      </Paper>

      {/* Grid Stats Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Schools"
            value={dashboard.totalSchools}
            color="#2563EB"
            icon={<SchoolIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Admins"
            value={dashboard.totalAdmins}
            color="#7C3AED"
            icon={<PersonIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Students"
            value={dashboard.totalStudents}
            color="#16A34A"
            icon={<GroupsIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Buses"
            value={dashboard.totalBuses}
            color="#EA580C"
            icon={<DirectionsBusIcon />}
          />
        </Grid>
      </Grid>

      {/* Modern High-Contrast Table Container Card */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 4,
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 18px rgba(15, 23, 42, 0.03)",
        }}
      >
        <Typography variant="h5" fontWeight="700" color="#0f172a" sx={{ mb: 3 }}>
          Recent Schools
        </Typography>

        <Box mt={2}>
          {dashboard.recentSchools.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ background: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: "700", color: "#475569", py: 2 }}>
                      Institution Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", color: "#475569", py: 2 }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboard.recentSchools.map((school) => (
                    <TableRow
                      key={school._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { background: "#f8fafc" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell sx={{ py: 2.5, fontWeight: "600", color: "#0f172a", fontSize: "14px" }}>
                        🏫 {school.schoolName || school.name}
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box
                          component="span"
                          sx={{
                            background: "#dcfce7",
                            color: "#15803d",
                            px: 2,
                            py: 0.6,
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Registered
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1",
              }}
            >
              <Typography color="text.secondary" fontWeight="500">
                No Schools Found
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </PageContainer>
  );
}