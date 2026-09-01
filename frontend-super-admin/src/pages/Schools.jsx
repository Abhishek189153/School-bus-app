import {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Button,
  Typography,
  Chip,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";

import AddIcon
from "@mui/icons-material/Add";

import SearchIcon
from "@mui/icons-material/Search";

import {
  DataGrid,
} from "@mui/x-data-grid";

import axios
from "../api/axios";

import AddSchoolDialog
from "../components/AddSchoolDialog";

import {
  IconButton,
  Tooltip,
} from "@mui/material";

import VisibilityIcon
from "@mui/icons-material/Visibility";

import EditIcon
from "@mui/icons-material/Edit";

import DeleteIcon
from "@mui/icons-material/Delete";

import ConfirmDelete
from "../components/ConfirmDelete";

import SchoolDetails
from "../components/SchoolDetails";

import EditSchoolDialog
from "../components/EditSchoolDialog";


// ===============================================================
// Subscription status -> chip color. Extend if you add more
// states on the backend (e.g. "Trial", "Cancelled").
// ===============================================================
const SUBSCRIPTION_STYLES = {
  Active: { bg: "#dcfce7", color: "#15803d" },
  Trial: { bg: "#fef3c7", color: "#b45309" },
  Expired: { bg: "#fee2e2", color: "#b91c1c" },
  Inactive: { bg: "#f1f5f9", color: "#64748b" },
};

function SubscriptionChip({ status }) {
  const s = SUBSCRIPTION_STYLES[status] || SUBSCRIPTION_STYLES.Inactive;
  return (
    <Chip
      label={status || "Inactive"}
      size="small"
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 700,
        fontSize: "12px",
        height: 26,
      }}
    />
  );
}

export default function Schools() {

  const [schools,setSchools]=useState([]);

  const [loading,setLoading]=useState(true);

  const [searchQuery,setSearchQuery]=useState("");

  const [open,setOpen]= useState(false);

  const [deleteOpen,setDeleteOpen]=
useState(false);

  const [selectedSchool,setSelectedSchool]=
useState(null);

const [viewOpen,setViewOpen]=
useState(false);

const [viewSchool,setViewSchool]=
useState(null);

const [editOpen,setEditOpen]=
useState(false);

const [editSchool,setEditSchool]=
useState(null);

// Controlled pagination model — needed so the "#" column can
// compute a row's absolute position (not just its position
// within the current page).
const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 10,
});

  useEffect(()=>{
    loadSchools();
  },[]);

  // Reset to page 1 whenever the search text changes, so results
  // from a new search are never hidden on a stale page number.
  useEffect(()=>{
    setPaginationModel((prev)=>({ ...prev, page: 0 }));
  },[searchQuery]);

  // Client-side filter — schools are already fetched in full on
  // load, so search just narrows the in-memory list. Matches
  // school name, address, phone, or email.
  const filteredSchools = schools.filter((school)=>{
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      school.schoolName?.toLowerCase().includes(q) ||
      school.address?.toLowerCase().includes(q) ||
      school.phone?.toLowerCase().includes(q) ||
      school.email?.toLowerCase().includes(q)
    );
  });

  const loadSchools=async()=>{

    try{

      setLoading(true);

      const res=
      await axios.get("/schools");

      setSchools(
        res.data.schools
      );

    }catch(err){

      console.log(err);

    }finally{

      setLoading(false);

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
    field: "schoolName",
    headerName: "School",
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
    field: "address",
    headerName: "Address",
    flex: 1,
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
    field: "subscriptionStatus",
    headerName: "Subscription",
    width: 160,
    renderCell: (params) => <SubscriptionChip status={params.value} />,
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
            onClick={() => handleView(params.row)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>

        </Tooltip>

        <Tooltip title="Edit">

          <IconButton
            size="small"
            color="warning"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>

        </Tooltip>

        <Tooltip title="Delete">

          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

        </Tooltip>

      </>

    ),

  },

];

   const handleView=(school)=>{

setViewSchool(school);

setViewOpen(true);

};

const handleEdit=(school)=>{

setEditSchool(school);

setEditOpen(true);

};

const handleDelete = (school) => {

  setSelectedSchool(school);

  setDeleteOpen(true);

};

const deleteSchool = async () => {

  try {

    await axios.delete(

      `/schools/${selectedSchool._id}`

    );

    setDeleteOpen(false);

    loadSchools();

  } catch (err) {

    alert(err.response?.data?.message);

  }

};

  return(

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

Schools

</Typography>

<Typography sx={{ fontSize: 13.5, color: "#64748b", mt: 0.5 }}>

Manage every registered school and its subscription status

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

onChange={(e)=>setSearchQuery(e.target.value)}

placeholder="Search schools..."

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
      <IconButton size="small" onClick={()=>setSearchQuery("")}>
        <Typography sx={{ fontSize: 16, color: "#94a3b8", lineHeight: 1 }}>×</Typography>
      </IconButton>
    </InputAdornment>
  ) : null,

}}

/>

<Button

variant="contained"

startIcon={<AddIcon/>}

onClick={()=>setOpen(true)}

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

Add School

</Button>

</Box>

</Box>

<Paper

variant="outlined"

sx={{

height:600,

background:"#fff",

borderRadius:"16px",

borderColor: "#e2e8f0",

overflow: "hidden",

}}

>

<DataGrid

rows={filteredSchools}

columns={columns}

getRowId={(row)=>row._id}

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

<AddSchoolDialog

open={open}

onClose={()=>setOpen(false)}

onSuccess={loadSchools}

/>

<ConfirmDelete

open={deleteOpen}

title={selectedSchool?.schoolName}

onClose={() => setDeleteOpen(false)}

onConfirm={deleteSchool}

/>

<SchoolDetails

open={viewOpen}

school={viewSchool}

onClose={()=>
setViewOpen(false)
}

/>

<EditSchoolDialog

open={editOpen}

school={editSchool}

onClose={()=>
setEditOpen(false)
}

onSuccess={loadSchools}

/>

</Box>

);

}
