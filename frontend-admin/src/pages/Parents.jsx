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

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete parent?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteParent(id);

        fetchParents();

      } catch (error) {

        console.log(error);

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
      <Typography
        variant="h4"
        gutterBottom
      >
        Parents
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() =>
          setOpen(true)
        }
      >
        Add Parent
      </Button>

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
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {parents.map(
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

    </>
  );
};

export default Parents;