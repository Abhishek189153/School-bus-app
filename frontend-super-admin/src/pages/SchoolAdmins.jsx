import {
  useEffect,
  useState,
} from "react";


import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  DataGrid,
} from "@mui/x-data-grid";

import {
  getSchoolAdmins,
} from "../services/schoolAdmin.service";

import AddSchoolAdminDialog from "../components/AddSchoolAdminDialog";

import SchoolAdminDetails
from "../components/SchoolAdminDetails";

import EditSchoolAdminDialog
from "../components/EditSchoolAdminDialog";

import ConfirmDelete
from "../components/ConfirmDelete";

import {
  deleteSchoolAdmin,
} from "../services/schoolAdmin.service";

export default function SchoolAdmins() {

  const [
    admins,
    setAdmins,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
viewOpen,
setViewOpen,
] = useState(false);

const [
viewAdmin,
setViewAdmin,
] = useState(null);

const [
editOpen,
setEditOpen,
] = useState(false);

const [
editAdmin,
setEditAdmin,
] = useState(null);

const [
deleteOpen,
setDeleteOpen,
] = useState(false);

const [
selectedAdmin,
setSelectedAdmin,
] = useState(null);

// Controlled pagination model — needed so the "#" column can
// compute a row's absolute position across pages, not just its
// position within the current page.
const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 10,
});

  useEffect(() => {

    loadAdmins();

  }, []);

  // Reset to page 1 whenever the search text changes, so results
  // from a new search are never hidden on a stale page number.
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [searchQuery]);

  const loadAdmins = async () => {

    try {

      setLoading(true);

      const data =
        await getSchoolAdmins();

      setAdmins(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // Client-side filter — admins are already fetched in full on
  // load, so search just narrows the in-memory list. Matches
  // admin name, email, phone, or their assigned school's name.
  const filteredAdmins = admins.filter((admin) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      admin.name?.toLowerCase().includes(q) ||
      admin.email?.toLowerCase().includes(q) ||
      admin.phone?.toLowerCase().includes(q) ||
      admin.schoolId?.schoolName?.toLowerCase().includes(q)
    );
  });

  const handleView = (admin) => {

    setViewAdmin(admin);

    setViewOpen(true);

};

const handleEdit = (admin) => {

    setEditAdmin(admin);

    setEditOpen(true);

};

const handleDelete = (admin) => {

  setSelectedAdmin(admin);

  setDeleteOpen(true);

};

const deleteAdmin = async () => {

  try {

    await deleteSchoolAdmin(
      selectedAdmin._id
    );

    setDeleteOpen(false);

    loadAdmins();

  } catch (err) {

    alert(

      err.response?.data?.message ||

      "Unable to delete."

    );

  }

};

  const columns = [

    {

      field: "__rowNumber",

      headerName: "#",

      width: 64,

      sortable: false,

      filterable: false,

      disableColumnMenu: true,

      renderCell: (params) => {
        const indexOnPage = params.api.getRowIndexRelativeToVisibleRows(params.id);
        const absoluteIndex =
          paginationModel.page * paginationModel.pageSize + indexOnPage + 1;
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
              {absoluteIndex}
            </Typography>
          </Box>
        );
      },

    },

    {

      field: "name",

      headerName: "Name",

      flex: 1,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>
            {params.value}
          </Typography>
        </Box>
      ),

    },

    {

      field: "school",

      headerName: "School",

      flex: 1,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={{ fontSize: 13.5, color: "#334155" }}>
            {params.row.schoolId?.schoolName || "-"}
          </Typography>
        </Box>
      ),

    },

    {

      field: "phone",

      headerName: "Phone",

      width: 150,

    },

    {

      field: "email",

      headerName: "Email",

      flex: 1,

    },

   {
  field: "isFirstLogin",

  headerName: "Account Status",

  width: 180,

  renderCell: (params) => (

    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
      <Chip
        label={
          params.row.isFirstLogin
            ? "Pending Setup"
            : "Active"
        }

        color={
          params.row.isFirstLogin
            ? "warning"
            : "success"
        }

        size="small"

        sx={{ fontWeight: 700, fontSize: 12 }}
      />
    </Box>

  ),
},

    {

      field: "actions",

      headerName: "Actions",

      width: 150,

      sortable: false,

      filterable: false,

      disableColumnMenu: true,

      renderCell: (params) => (

        <>

          <Tooltip title="View">

           <IconButton

    size="small"

    color="primary"

    onClick={() =>
        handleView(params.row)
    }

>

              <VisibilityIcon fontSize="small" />

            </IconButton>

          </Tooltip>

          <Tooltip title="Edit">

           <IconButton

    size="small"

    color="warning"

    onClick={() =>
        handleEdit(params.row)
    }

>

              <EditIcon fontSize="small" />

            </IconButton>

          </Tooltip>

          <Tooltip title="Delete">

           <IconButton

  size="small"

  color="error"

  onClick={() =>
    handleDelete(params.row)
  }

>

  <DeleteIcon fontSize="small" />

</IconButton>

          </Tooltip>

        </>

      ),

    },

  ];

  return (

    <Box>

      <Box

        sx={{
          display: "flex",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}

      >

        <Box>

          <Typography

            variant="h4"

            sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", fontSize: { xs: 24, md: 30 } }}

          >

            School Admins

          </Typography>

          <Typography sx={{ fontSize: 13.5, color: "#64748b", mt: 0.5 }}>

            Manage the admins assigned to each registered school

          </Typography>

        </Box>

        <Box

          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 1.5,
            ml: "auto",
            width: { xs: "100%", md: "auto" },
          }}

        >

          <TextField

            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)}

            placeholder="Search admins..."

            size="small"

            sx={{

              width: { xs: "100%", sm: 260, md: 300 },

              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fff",

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
                  <SearchIcon sx={{ fontSize: 20, color: "#64748b" }} />
                </InputAdornment>
              ),

              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <Typography sx={{ fontSize: 16, color: "#94a3b8", lineHeight: 1 }}>×</Typography>
                  </IconButton>
                </InputAdornment>
              ) : null,

            }}

          />

          <Button

            variant="contained"

            startIcon={<AddIcon />}

            onClick={() => setOpen(true)}

            sx={{

              background: "#2563EB",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              py: 1.1,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(37,99,235,0.25)",

              "&:hover": {
                background: "#1D4ED8",
                boxShadow: "0 6px 16px rgba(37,99,235,0.32)",
              },

            }}

          >

            Add School Admin

          </Button>

        </Box>

      </Box>

      <Paper

        variant="outlined"

        sx={{

          height: 600,

          background: "#fff",

          borderRadius: "16px",

          borderColor: "#e2e8f0",

          overflow: "hidden",

        }}

      >

        <DataGrid

          rows={filteredAdmins}

          columns={columns}

          getRowId={(row) => row._id}

          loading={loading}

          paginationModel={paginationModel}

          onPaginationModelChange={setPaginationModel}

          pageSizeOptions={[10, 25, 50]}

          disableRowSelectionOnClick

          rowHeight={58}

          sx={{

            border: "none",

            "& .MuiDataGrid-columnHeaders": {
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 800,
              fontSize: 12.5,
              letterSpacing: "0.4px",
              color: "#334155",
              textTransform: "uppercase",
            },

            "& .MuiDataGrid-cell": {
              borderColor: "#f1f5f9",
              fontSize: 13.5,
              color: "#334155",
            },

            "& .MuiDataGrid-row:hover": {
              background: "#f8fafc",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #e2e8f0",
            },

            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },

          }}

        />

      </Paper>

      <AddSchoolAdminDialog

        open={open}

        onClose={() => setOpen(false)}

        onSuccess={loadAdmins}

      />

      <SchoolAdminDetails

    open={viewOpen}

    admin={viewAdmin}

    onClose={() =>
        setViewOpen(false)
    }

/>

    <EditSchoolAdminDialog

    open={editOpen}

    admin={editAdmin}

    onClose={() =>
        setEditOpen(false)
    }

    onSuccess={loadAdmins}

/>

<ConfirmDelete

  open={deleteOpen}

  title={selectedAdmin?.name}

  onClose={() =>
    setDeleteOpen(false)
  }

  onConfirm={deleteAdmin}

/>

    </Box>

  );

}
