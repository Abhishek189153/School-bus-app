import {
  useEffect,
  useState,
} from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Box
} from "@mui/material";

import {
  getParents,
  deleteParent,
} from "../services/parent.service";

import AddParentModal from "../components/AddParentModal";
import EditParentModal from "../components/EditParentModal";

const Parents = () => {

  const [parents, setParents] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [snackbar, setSnackbar] =
  useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [open, setOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedParent,
    setSelectedParent] =
    useState(null);

  const fetchParents =
    async () => {

      try {

        const data =
          await getParents();

        setParents(
          data.parents
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Delete parent?"
    );

  if (!confirmDelete)
    return;

  try {

    const response =
      await deleteParent(id);

    setSnackbar({
      open: true,
      message:
        response.message,
      severity: "success",
    });

    fetchParents();

  } catch (error) {

    setSnackbar({
      open: true,
      message:
        error.response?.data
          ?.message ||
        "Assigned parent cannot be deleted, unassign first",
      severity: "error",
    });

  }
};

  const handleEdit =
    (parent) => {

      setSelectedParent(
        parent
      );

      setEditOpen(true);
    };

  return (
    <>

    
          <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          mb: 2,
        }}
      >

        <Typography
          variant="h4"
          sx={{ mb: 0 }}
        >
          Parents
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            setOpen(true)
          }
        >
          Add Parent
        </Button>

        <TextField
          label="Search Parent, Phone or Student"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          size="small"
          sx={{
            width: 950,

            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",

              "& fieldset": {
                borderColor: "#080000",
                borderWidth: "2px",
              },

              "&:hover fieldset": {
                borderColor: "#1976d2",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
                borderWidth: "2px",
              },
            },
          }}
        />

      </Box>

      <TableContainer
        component={Paper}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Name
              </TableCell>

              <TableCell>
  Phone
                </TableCell>

                <TableCell>
                  Student
                </TableCell>

                <TableCell>
                  Actions
                </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {parents
              .filter(
              (parent) =>
                parent.name
                  ?.toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  ) ||

                parent.phone
                  ?.includes(searchTerm) ||

                parent.studentName
                  ?.toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  )
            )
              .map(
                (parent) => (

                <TableRow
                  key={parent._id}
                >

                  <TableCell>
                    {parent.name}
                  </TableCell>

                 <TableCell>
                  {parent.phone}
                </TableCell>

                <TableCell>
                  {parent.studentName}
                </TableCell>

                <TableCell>

                  <Button
                    onClick={() =>
                      handleEdit(
                        parent
                      )
                    }
                  >
                    Edit
                  </Button>

                    <Button
                      color="error"
                      onClick={() =>
                        handleDelete(
                          parent._id
                        )
                      }
                    >
                      Delete
                    </Button>

                  </TableCell>

                </TableRow>

              )
            )}

          </TableBody>

        </Table>

      </TableContainer>

      <AddParentModal
        open={open}
        handleClose={() =>
          setOpen(false)
        }
        refreshParents={
          fetchParents
        }
      />

      <EditParentModal
        open={editOpen}
        handleClose={() =>
          setEditOpen(false)
        }
        parent={selectedParent}
        refreshParents={
          fetchParents
        }
      />


<Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() =>
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }
>
  <Alert
    severity={snackbar.severity}
    variant="filled"
  >
    {snackbar.message}
  </Alert>
</Snackbar>

    </>
  );
};

export default Parents;