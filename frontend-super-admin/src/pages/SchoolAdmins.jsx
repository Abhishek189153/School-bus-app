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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
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

  useEffect(() => {

    loadAdmins();

  }, []);

  const loadAdmins = async () => {

    try {

      const data =
        await getSchoolAdmins();

      setAdmins(data);

    } catch (err) {

      console.log(err);

    }

  };

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

      field: "name",

      headerName: "Name",

      flex: 1,

    },

    {

      field: "school",

      headerName: "School",

      flex: 1,

      renderCell: (params) =>
        params.row.schoolId?.schoolName || "-",

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
    />

  ),
},

    {

      field: "actions",

      headerName: "Actions",

      width: 170,

      sortable: false,

      renderCell: (params) => (

        <>

          <Tooltip title="View">

           <IconButton

    color="primary"

    onClick={() =>
        handleView(params.row)
    }

>

              <VisibilityIcon />

            </IconButton>

          </Tooltip>

          <Tooltip title="Edit">

           <IconButton

    color="warning"

    onClick={() =>
        handleEdit(params.row)
    }

>

              <EditIcon />

            </IconButton>

          </Tooltip>

          <Tooltip title="Delete">

           <IconButton

  color="error"

  onClick={() =>
    handleDelete(params.row)
  }

>

  <DeleteIcon />

</IconButton>

          </Tooltip>

        </>

      ),

    },

  ];

  return (

    <Box>

      <Box

        display="flex"

        justifyContent="space-between"

        alignItems="center"

        mb={2}

      >

        <Typography

          variant="h4"

          fontWeight="bold"

        >

          School Admins

        </Typography>

        <Button

          variant="contained"

          startIcon={<AddIcon />}

          onClick={() => setOpen(true)}

        >

          Add School Admin

        </Button>

      </Box>

      <Box

        sx={{

          height: 600,

          background: "#fff",

          borderRadius: 3,

        }}

      >

        <DataGrid

          rows={admins}

          columns={columns}

          getRowId={(row) => row._id}

          pageSizeOptions={[10]}

        />

      </Box>

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