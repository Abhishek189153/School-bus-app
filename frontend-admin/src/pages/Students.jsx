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
  TextField,
  Box
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

  const [searchTerm, setSearchTerm] =
    useState("");  

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

    const filteredStudents =
      students.filter(
        (student) =>
          (
            (student.admissionNumber || "") +
            " " +
            (student.name || "") +
            " " +
            (student.parentId?.name || "") +
            " " +
            (student.className || "")+
            " "  +
            (student.routeId?.routeName || "") +
            " " +
            (student.busId?.busNumber || "") +
            " " +
            (student.pickupStop || "")    
          )
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );

  return (
    <>
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    mb: 2,
  }}
>

  <Typography
    variant="h4"
  >
    Students
  </Typography>

  <Button
    variant="contained"
    onClick={() =>
      setOpen(true)
    }
  >
    Add Student
  </Button>

  <TextField
  label="Search Student, Admission No, Parent, Class, Route, Bus, Pickup Stop"
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  size="small"
  sx={{
    width: 950,
    ml: 4,

    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",

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
                Admission No.
              </TableCell>

              <TableCell>
                Name
              </TableCell>

              <TableCell>
                Parent
              </TableCell>


              <TableCell>
                Route
              </TableCell>

              <TableCell>
                Bus
              </TableCell>

              <TableCell>
                Pickup Stop
              </TableCell>

              <TableCell>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {filteredStudents.map(
              (student) => (

                <TableRow
                  key={student._id}
                >

                  <TableCell>
                    {student.admissionNumber}
                  </TableCell>  

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
                    student.routeId
                      ?.routeName
                  }
                </TableCell>


                  <TableCell>
                    {
                      student.busId
                        ?.busNumber
                    }
                  </TableCell>

                  <TableCell>
                    {
                      student.pickupStop
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