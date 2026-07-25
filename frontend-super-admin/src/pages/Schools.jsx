import {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import AddIcon
from "@mui/icons-material/Add";

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


export default function Schools() {

  const [schools,setSchools]=useState([]);

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

  useEffect(()=>{
    loadSchools();
  },[]);

  const loadSchools=async()=>{

    try{

      const res=
      await axios.get("/schools");

      setSchools(
        res.data.schools
      );

    }catch(err){

      console.log(err);

    }

  };

  const columns = [

  {
    field: "schoolName",
    headerName: "School",
    flex: 1,
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
  },

  {
    field: "actions",
    headerName: "Actions",
    width: 180,

    sortable: false,

    renderCell: (params) => (

      <>

        <Tooltip title="View">

          <IconButton
            color="primary"
            onClick={() => handleView(params.row)}
          >
            <VisibilityIcon />
          </IconButton>

        </Tooltip>

        <Tooltip title="Edit">

          <IconButton
            color="warning"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>

        </Tooltip>

        <Tooltip title="Delete">

          <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
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

display="flex"

justifyContent="space-between"

alignItems="center"



>

<Typography

variant="h4"

fontWeight="bold"

>

Schools

</Typography>

<Button

variant="contained"

startIcon={<AddIcon/>}

onClick={()=>setOpen(true)}

>

Add School

</Button>

</Box>

<Box

sx={{

height:600,

background:"#fff",

borderRadius:3,

}}

>

<DataGrid

rows={schools}

columns={columns}

getRowId={(row)=>row._id}

pageSizeOptions={[10]}

/>

</Box>

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

/>,

<SchoolDetails

open={viewOpen}

school={viewSchool}

onClose={()=>
setViewOpen(false)
}

/>,

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



