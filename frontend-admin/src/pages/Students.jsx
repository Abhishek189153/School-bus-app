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
  getStudents,
  deleteStudent,
} from "../services/student.service";

import AddStudentModal from "../components/AddStudentModal";
import EditStudentModal from "../components/EditStudentModal";

const Students = () => {

  const [students, setStudents] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedStudent,
    setSelectedStudent] =
    useState(null);

  const fetchStudents =
    async () => {

      try {

        const data =
          await getStudents();

        setStudents(
          data.students
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete student?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteStudent(id);

        fetchStudents();

      } catch (error) {

        console.log(error);

      }
    };

  const handleEdit =
    (student) => {

      setSelectedStudent(
        student
      );

      setEditOpen(true);
    };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Students
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() =>
          setOpen(true)
        }
      >
        Add Student
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
                Parent
              </TableCell>

              <TableCell>
                Bus
              </TableCell>

              <TableCell>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {students.map(
              (student) => (

                <TableRow
                  key={student._id}
                >

                  <TableCell>
                    {student.name}
                  </TableCell>

                  <TableCell>
                    {
                      student.parentId
                        ?.name
                    }
                  </TableCell>

                  <TableCell>
                    {
                      student.busId
                        ?.busNumber
                    }
                  </TableCell>

                  <TableCell>

                    <Button
                      onClick={() =>
                        handleEdit(
                          student
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      color="error"
                      onClick={() =>
                        handleDelete(
                          student._id
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

      <AddStudentModal
        open={open}
        handleClose={() =>
          setOpen(false)
        }
        refreshStudents={
          fetchStudents
        }
      />

      <EditStudentModal
        open={editOpen}
        handleClose={() =>
          setEditOpen(false)
        }
        student={selectedStudent}
        refreshStudents={
          fetchStudents
        }
      />

    </>
  );
};

export default Students;