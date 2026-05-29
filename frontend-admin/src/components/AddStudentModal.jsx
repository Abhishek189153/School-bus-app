import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

import { useState, useEffect } from "react";

import { getParents } from "../services/parent.service";
import { getBuses } from "../services/bus.service";
import { createStudent } from "../services/student.service";

const AddStudentModal = ({
  open,
  handleClose,
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

    if (open) {
      loadData();
    }

  }, [open]);

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

        await createStudent(
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
        Add Student
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          label="Student Name"
          name="name"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Class"
          name="className"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          label="Parent"
          name="parentId"
          margin="normal"
          onChange={handleChange}
        >

          {parents.map(
            (parent) => (

              <MenuItem
                key={parent._id}
                value={parent._id}
              >
                {parent.name}
              </MenuItem>

            )
          )}

        </TextField>

        <TextField
          select
          fullWidth
          label="Bus"
          name="busId"
          margin="normal"
          onChange={handleChange}
        >

          {buses.map(
            (bus) => (

              <MenuItem
                key={bus._id}
                value={bus._id}
              >
                {bus.busNumber}
              </MenuItem>

            )
          )}

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
          Save
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default AddStudentModal;