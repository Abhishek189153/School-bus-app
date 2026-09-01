import {
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
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getDashboard } from "../services/dashboard.service";

import SchoolIcon from "@mui/icons-material/School";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import PageContainer from "../components/PageContainer";

export default function Dashboard() {
  // =========================================================
  // DASHBOARD DATA
  // =========================================================

  const [dashboard, setDashboard] = useState({
    totalSchools: 0,
    totalAdmins: 0,
    totalStudents: 0,
    totalBuses: 0,
    schools: [],
    pagination: {
      page: 1,
      limit: 5,
      totalSchools: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  // =========================================================
  // SEARCH
  // =========================================================

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] = useState(false);

  // =========================================================
  // CURRENT PAGE
  // =========================================================

  const [page, setPage] = useState(0);

  // MUI TablePagination uses 0-based page
  // Backend uses 1-based page

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // =========================================================
  // DEBOUNCE SEARCH
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());

      // Whenever search changes,
      // start from first page.
      setPage(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {
    loadDashboard();
  }, [page, rowsPerPage, search]);

  // =========================================================
  // API CALL
  // =========================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboard(
        page + 1,
        rowsPerPage,
        search
      );

      setDashboard(data);
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PAGINATION - PAGE CHANGE
  // =========================================================

  const handleChangePage = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };

  // =========================================================
  // PAGINATION - ROWS PER PAGE
  // =========================================================

  const handleChangeRowsPerPage = (
    event
  ) => {
    const newLimit = parseInt(
      event.target.value,
      10
    );

    setRowsPerPage(newLimit);
    setPage(0);
  };

  // =========================================================
  // SAFE USER DATA
  // =========================================================

  let userName = "Admin";

  try {
    const user = JSON.parse(
      sessionStorage.getItem("user")
    );

    userName = user?.name || "Admin";
  } catch (error) {
    console.error(
      "Unable to read user:",
      error
    );
  }

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <PageContainer>

      {/* =====================================================
          TOP BANNER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: {
            xs: 3,
            md: 5,
          },

          background:
            "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",

          color: "#fff",

          mb: 4,

          boxShadow:
            "0 10px 25px rgba(37, 99, 235, 0.15)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="800"
          sx={{
            letterSpacing: "-0.5px",
          }}
        >
          Welcome {userName}
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
          Manage all schools, buses, parents and
          school administrators from one central
          dashboard view.
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
      </Paper>

      {/* =====================================================
          SCHOOLS SECTION
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border:
            "1px solid #e2e8f0",

          boxShadow:
            "0 4px 18px rgba(15, 23, 42, 0.04)",

          overflow: "hidden",
        }}
      >

        {/* ===================================================
            TABLE HEADER
        =================================================== */}

        <Box
          sx={{
            px: {
              xs: 2,
              md: 3,
            },

            py: 2.5,

            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            gap: 3,

            flexWrap: "wrap",

            borderBottom:
              "1px solid #e2e8f0",
          }}
        >

          {/* LEFT SIDE */}
          <Box
            sx={{
              minWidth: "200px",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="700"
              color="#0f172a"
            >
              Schools
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              Overview of registered schools
              and their transport information
            </Typography>
          </Box>

          {/* SEARCH */}
          <TextField
            value={searchInput}
            onChange={(e) =>
              setSearchInput(e.target.value)
            }
            placeholder="Search School..."
            size="small"
            sx={{
              width: {
                xs: "100%",
                sm: "260px",
                md: "300px",
              },

              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#f8fafc",

                "& fieldset": {
                  borderColor: "#e2e8f0",
                },

                "&:hover fieldset": {
                  borderColor: "#cbd5e1",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#2563EB",
                  borderWidth: "1px",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      fontSize: 20,
                      color: "#64748b",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* =================================================
              SUMMARY BADGES
          ================================================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,

              flexWrap: "wrap",

              justifyContent: "flex-end",
            }}
          >

            {/* SCHOOLS */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,

                px: 1.4,
                py: 0.8,

                borderRadius: "10px",

                background: "#eff6ff",
                color: "#2563eb",

                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              <SchoolIcon
                sx={{
                  fontSize: 17,
                }}
              />

              {dashboard.totalSchools} Schools
            </Box>

            {/* STUDENTS */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,

                px: 1.4,
                py: 0.8,

                borderRadius: "10px",

                background: "#f0fdf4",
                color: "#15803d",

                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              <GroupsIcon
                sx={{
                  fontSize: 17,
                }}
              />

              {dashboard.totalStudents} Students
            </Box>

            {/* BUSES */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,

                px: 1.4,
                py: 0.8,

                borderRadius: "10px",

                background: "#fff7ed",
                color: "#c2410c",

                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              <DirectionsBusIcon
                sx={{
                  fontSize: 17,
                }}
              />

              {dashboard.totalBuses} Buses
            </Box>

            {/* LIVE SYNC */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,

                px: 1.4,
                py: 0.8,

                borderRadius: "10px",

                background: "#f8fafc",
                color: "#475569",

                border:
                  "1px solid #e2e8f0",

                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow:
                    "0 0 0 3px rgba(34,197,94,0.12)",
                }}
              />

              Live Sync
            </Box>
          </Box>
        </Box>

        {/* ===================================================
            TABLE
        =================================================== */}

        <Box
          sx={{
            p: {
              xs: 1.5,
              md: 2,
            },
          }}
        >

          <TableContainer
            sx={{
              border:
                "1px solid #e2e8f0",

              borderRadius: "14px",

              overflow: "hidden",
            }}
          >
            <Table
              sx={{
                minWidth: 750,
              }}
            >

              {/* =================================================
                  TABLE HEAD
              ================================================= */}

              <TableHead>
                <TableRow
                  sx={{
                    background:
                      "#f8fafc",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: "800",
                      color: "#334155",
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                      py: 2,
                    }}
                  >
                    SCHOOL
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "800",
                      color: "#334155",
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                      py: 2,
                    }}
                  >
                    TOTAL STUDENTS
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "800",
                      color: "#334155",
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                      py: 2,
                    }}
                  >
                    TOTAL BUSES
                  </TableCell>


                    {/* SUBSCRIPTION START DATE */}
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "800",
                      color: "#334155",
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                      py: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    SUBSCRIPTION START
                  </TableCell>


                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "800",
                      color: "#334155",
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                      py: 2,
                    }}
                  >
                    STATUS
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* =================================================
                  TABLE BODY
              ================================================= */}

              <TableBody>

                {/* LOADING */}
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        py: 7,
                      }}
                    >
                      <CircularProgress
                        size={28}
                        sx={{
                          color: "#2563EB",
                        }}
                      />

                      <Typography
                        sx={{
                          mt: 1.5,
                          color: "#64748b",
                          fontSize: "13px",
                        }}
                      >
                        Loading schools...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : dashboard.schools?.length >
                  0 ? (

                  dashboard.schools.map(
                    (school) => (
                      <TableRow
                        key={school._id}
                        sx={{
                          "&:last-child td, &:last-child th":
                            {
                              border: 0,
                            },

                          "&:hover": {
                            background:
                              "#f8fafc",
                          },

                          transition:
                            "background-color 0.2s",
                        }}
                      >

                        {/* SCHOOL */}
                        <TableCell
                          sx={{
                            py: 2.2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 36,
                                height: 36,

                                borderRadius:
                                  "10px",

                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                background:
                                  "#eff6ff",

                                color:
                                  "#2563EB",

                                flexShrink: 0,
                              }}
                            >
                              <SchoolIcon
                                sx={{
                                  fontSize: 19,
                                }}
                              />
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  fontWeight:
                                    "700",

                                  color:
                                    "#0f172a",

                                  fontSize:
                                    "14px",
                                }}
                              >
                                {school.schoolName ||
                                  school.name ||
                                  "Unnamed School"}
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize:
                                    "11px",

                                  color:
                                    "#94a3b8",

                                  mt: 0.3,
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
                            py: 2.2,
                          }}
                        >
                          <Box
                            sx={{
                              display:
                                "inline-flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              minWidth: 48,

                              px: 1.5,
                              py: 0.8,

                              borderRadius:
                                "8px",

                              background:
                                "#f0fdf4",

                              color:
                                "#15803d",

                              fontSize:
                                "13px",

                              fontWeight:
                                "800",
                            }}
                          >
                            {school.totalStudents ??
                              0}
                          </Box>
                        </TableCell>

                        {/* BUSES */}
                        <TableCell
                          align="center"
                          sx={{
                            py: 2.2,
                          }}
                        >
                          <Box
                            sx={{
                              display:
                                "inline-flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              minWidth: 48,

                              px: 1.5,
                              py: 0.8,

                              borderRadius:
                                "8px",

                              background:
                                "#fff7ed",

                              color:
                                "#c2410c",

                              fontSize:
                                "13px",

                              fontWeight:
                                "800",
                            }}
                          >
                            {school.totalBuses ??
                              0}
                          </Box>
                        </TableCell>


                        {/* SUBSCRIPTION START DATE */}
                            <TableCell
                              align="center"
                              sx={{
                                py: 2.2,
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  color: "#475569",
                                }}
                              >
                               {school.createdAt
                                ? new Date(school.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                              </Typography>
                            </TableCell>

                        {/* STATUS */}
                        <TableCell
                          align="center"
                          sx={{
                            py: 2.2,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              display:
                                "inline-flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              background:
                                "#dcfce7",

                              color:
                                "#15803d",

                              px: 1.8,
                              py: 0.6,

                              borderRadius:
                                "20px",

                              fontSize:
                                "11px",

                              fontWeight:
                                "700",

                              border:
                                "1px solid #bbf7d0",
                            }}
                          >
                            Registered
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  )

                ) : (

                  /* NO RESULTS */
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        py: 6,
                      }}
                    >
                      <SchoolIcon
                        sx={{
                          fontSize: 40,
                          color: "#cbd5e1",
                        }}
                      />

                      <Typography
                        sx={{
                          mt: 1,
                          fontWeight:
                            "600",
                          color:
                            "#475569",
                        }}
                      >
                        {search
                          ? "No schools found"
                          : "No schools available"}
                      </Typography>

                      {search && (
                        <Typography
                          sx={{
                            mt: 0.5,
                            fontSize:
                              "13px",
                            color:
                              "#94a3b8",
                          }}
                        >
                          Try searching with
                          another school name.
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ===================================================
              PAGINATION
          =================================================== */}

          <TablePagination
            component="div"
            count={
              dashboard.pagination
                ?.totalSchools || 0
            }
            page={page}
            onPageChange={
              handleChangePage
            }
            rowsPerPage={
              rowsPerPage
            }
            onRowsPerPageChange={
              handleChangeRowsPerPage
            }
            rowsPerPageOptions={[
              5,
              10,
              25,
            ]}
            labelRowsPerPage="Schools per page"
            sx={{
              border: "none",

              "& .MuiTablePagination-toolbar":
                {
                  minHeight: 58,
                },

              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: "12px",
                  color: "#64748b",
                },

              "& .MuiTablePagination-select":
                {
                  fontWeight: "600",
                },

              "& .MuiIconButton-root":
                {
                  borderRadius: "8px",
                },
            }}
          />
        </Box>
      </Paper>
    </PageContainer>
  );
}