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
  TablePagination,
  Chip,
  Divider,
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
    schools: [],
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();

      setDashboard({
        totalSchools: data.totalSchools || 0,
        totalAdmins: data.totalAdmins || 0,
        totalStudents: data.totalStudents || 0,
        totalBuses: data.totalBuses || 0,
        schools: data.schools || [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Schools displayed on current page
  const paginatedSchools = dashboard.schools.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <PageContainer>

      {/* =========================================================
          WELCOME BANNER
      ========================================================= */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: { xs: 4, md: 5 },
          background:
            "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
          color: "#fff",
          mb: 4,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(37, 99, 235, 0.18)",
        }}
      >
        {/* Decorative background */}
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            right: -70,
            top: -90,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            right: 100,
            bottom: -90,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{
              letterSpacing: "-0.5px",
            }}
          >
            Welcome{" "}
            {JSON.parse(sessionStorage.getItem("user"))?.name}
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
            Manage all schools, buses, parents and school
            administrators from one central dashboard view.
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
              boxShadow:
                "0 4px 12px rgba(255, 255, 255, 0.1)",

              "&:hover": {
                background: "#f8fafc",
                boxShadow:
                  "0 6px 16px rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            Add School
          </Button>
        </Box>
      </Paper>

      {/* =========================================================
          STAT CARDS
      ========================================================= */}
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

      {/* =========================================================
          SCHOOLS TABLE
      ========================================================= */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow:
            "0 8px 30px rgba(15, 23, 42, 0.05)",
        }}
      >

        {/* =====================================================
            TABLE HEADER
        ===================================================== */}
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            pt: 3.5,
            pb: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 1,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight="800"
              color="#0f172a"
              sx={{
                letterSpacing: "-0.4px",
              }}
            >
              Schools
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Overview of registered schools and their
              transport information
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.8,
              borderRadius: "10px",
              background: "#eff6ff",
              color: "#2563EB",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            <SchoolIcon sx={{ fontSize: 18 }} />

            {dashboard.totalSchools} Schools
          </Box>
        </Box>

        <Divider />

        {/* =====================================================
            TABLE
        ===================================================== */}
        <Box sx={{ px: { xs: 2, md: 3 }, pt: 2 }}>

          {dashboard.schools.length > 0 ? (
            <>
              <TableContainer
                sx={{
                  border: "1px solid #eef2f7",
                  borderRadius: "14px",
                  overflowX: "auto",
                }}
              >
                <Table
                  sx={{
                    minWidth: 750,
                  }}
                >

                  {/* TABLE HEAD */}
                  <TableHead>
                    <TableRow
                      sx={{
                        background:
                          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: "800",
                          color: "#475569",
                          py: 2,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderBottom:
                            "1px solid #e2e8f0",
                        }}
                      >
                        School
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "800",
                          color: "#475569",
                          py: 2,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderBottom:
                            "1px solid #e2e8f0",
                        }}
                      >
                        Total Students
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "800",
                          color: "#475569",
                          py: 2,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderBottom:
                            "1px solid #e2e8f0",
                        }}
                      >
                        Total Buses
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "800",
                          color: "#475569",
                          py: 2,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderBottom:
                            "1px solid #e2e8f0",
                        }}
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  {/* TABLE BODY */}
                  <TableBody>
                    {paginatedSchools.map((school) => (
                      <TableRow
                        key={school._id}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },

                          "&:hover": {
                            background: "#f8fafc",
                          },

                          transition:
                            "background-color 0.2s ease",
                        }}
                      >

                        {/* SCHOOL */}
                        <TableCell
                          sx={{
                            py: 2.5,
                            borderBottom:
                              "1px solid #f1f5f9",
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
                                width: 38,
                                height: 38,
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#eff6ff",
                                color: "#2563EB",
                                flexShrink: 0,
                              }}
                            >
                              <SchoolIcon
                                sx={{
                                  fontSize: 20,
                                }}
                              />
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: "700",
                                  color: "#0f172a",
                                  fontSize: "14px",
                                }}
                              >
                                {school.schoolName ||
                                  school.name ||
                                  "Unnamed School"}
                              </Typography>

                              <Typography
                                sx={{
                                  color: "#94a3b8",
                                  fontSize: "11px",
                                  mt: 0.2,
                                }}
                              >
                                School Institution
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* STUDENTS */}
                        <TableCell
                          align="center"
                          sx={{
                            py: 2.5,
                            borderBottom:
                              "1px solid #f1f5f9",
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: 48,
                              px: 1.5,
                              py: 0.8,
                              borderRadius: "8px",
                              background: "#f0fdf4",
                              color: "#15803d",
                              fontWeight: "800",
                              fontSize: "14px",
                            }}
                          >
                            {school.totalStudents ?? 0}
                          </Box>
                        </TableCell>

                        {/* BUSES */}
                        <TableCell
                          align="center"
                          sx={{
                            py: 2.5,
                            borderBottom:
                              "1px solid #f1f5f9",
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: 48,
                              px: 1.5,
                              py: 0.8,
                              borderRadius: "8px",
                              background: "#fff7ed",
                              color: "#c2410c",
                              fontWeight: "800",
                              fontSize: "14px",
                            }}
                          >
                            {school.totalBuses ?? 0}
                          </Box>
                        </TableCell>

                        {/* STATUS */}
                        <TableCell
                          align="center"
                          sx={{
                            py: 2.5,
                            borderBottom:
                              "1px solid #f1f5f9",
                          }}
                        >
                          <Chip
                            label={
                              school.subscriptionStatus ===
                              "ACTIVE"
                                ? "Registered"
                                : "Inactive"
                            }
                            size="small"
                            sx={{
                              fontWeight: "700",
                              fontSize: "11px",
                              borderRadius: "20px",
                              px: 0.5,

                              background:
                                school.subscriptionStatus ===
                                "ACTIVE"
                                  ? "#dcfce7"
                                  : "#fee2e2",

                              color:
                                school.subscriptionStatus ===
                                "ACTIVE"
                                  ? "#15803d"
                                  : "#b91c1c",

                              border:
                                school.subscriptionStatus ===
                                "ACTIVE"
                                  ? "1px solid #bbf7d0"
                                  : "1px solid #fecaca",
                            }}
                          />
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </TableContainer>

              {/* =================================================
                  PAGINATION
              ================================================= */}
              <TablePagination
                component="div"
                count={dashboard.schools.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={
                  handleChangeRowsPerPage
                }
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Schools per page:"
                sx={{
                  mt: 1,

                  ".MuiTablePagination-toolbar": {
                    minHeight: 58,
                    px: 0,
                  },

                  ".MuiTablePagination-selectLabel": {
                    color: "#64748b",
                    fontSize: "13px",
                  },

                  ".MuiTablePagination-displayedRows": {
                    color: "#64748b",
                    fontSize: "13px",
                  },

                  ".MuiTablePagination-select": {
                    fontWeight: "600",
                  },

                  ".MuiIconButton-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </>
          ) : (
            /* =================================================
               EMPTY STATE
            ================================================= */
            <Box
              sx={{
                textAlign: "center",
                py: 7,
                px: 2,
                background: "#f8fafc",
                borderRadius: "14px",
                border: "1px dashed #cbd5e1",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#eff6ff",
                  color: "#2563EB",
                }}
              >
                <SchoolIcon sx={{ fontSize: 30 }} />
              </Box>

              <Typography
                color="#0f172a"
                fontWeight="700"
                fontSize="16px"
              >
                No Schools Found
              </Typography>

              <Typography
                color="#64748b"
                fontSize="13px"
                sx={{ mt: 0.5 }}
              >
                Schools will appear here once they are
                registered.
              </Typography>
            </Box>
          )}

        </Box>

        {/* Bottom spacing */}
        <Box sx={{ height: 12 }} />

      </Paper>

    </PageContainer>
  );
}