import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

import {
  useState,
  useEffect,
} from "react";

import {
  getParents,
} from "../services/parent.service";

import {
  getBuses,
} from "../services/bus.service";

import {
  updateStudent,
} from "../services/student.service";

const EditStudentModal = ({
  open,
  handleClose,
  student,
  refreshStudents,
}) => {

  const [parents, setParents] =
    useState([]);

  const [buses, setBuses] =
    useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      className: "",
      parentId: "",
      busId: "",
    });

  useEffect(() => {

    const loadData =
      async () => {

        const parentsData =
          await getParents();

        const busesData =
          await getBuses();

        setParents(
          parentsData.parents
        );

        setBuses(
          busesData.buses
        );
      };

    if (open && student) {

      loadData();

      setFormData({
        name:
          student.name || "",

        className:
          student.className || "",

        parentId:
          student.parentId?._id || "",

        busId:
          student.busId?._id || "",
      });
    }

  }, [open, student]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit =
    async () => {

      try {

        await updateStudent(
          student._id,
          formData
        );

        refreshStudents();

        handleClose();

      } catch (error) {

        console.log(error);

      }
    };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
    >

      <DialogTitle>
        Edit Student
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          label="Student Name"
          name="name"
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Class"
          name="className"
          margin="normal"
          value={formData.className}
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          label="Parent"
          name="parentId"
          margin="normal"
          value={formData.parentId}
          onChange={handleChange}
        >

          {parents.map((parent) => (

            <MenuItem
              key={parent._id}
              value={parent._id}
            >
              {parent.name}
            </MenuItem>

          ))}

        </TextField>

        <TextField
          select
          fullWidth
          label="Bus"
          name="busId"
          margin="normal"
          value={formData.busId}
          onChange={handleChange}
        >

          {buses.map((bus) => (

            <MenuItem
              key={bus._id}
              value={bus._id}
            >
              {bus.busNumber}
            </MenuItem>

          ))}

        </TextField>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Update
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default EditStudentModal;