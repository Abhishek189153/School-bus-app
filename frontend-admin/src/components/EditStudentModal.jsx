import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
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
  getBusesByRoute,
} from "../services/assignment.service";

import {
  updateStudent,
} from "../services/student.service";

import {
  getRoutes,
} from "../services/route.service";

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

  const [routes, setRoutes] =
  useState([]);

  const [routeStops,setRouteStops]=
  useState([]);

  const [routeBuses,setRouteBuses] =useState([]);

  const [formData, setFormData] =
    useState({
      admissionNumber: "",
      name: "",
      className: "",
      parentId: "",
      busId: "",
      routeId: "",
      pickupStop: "",
    });

  useEffect(() => {

    const loadData =
      async () => {

        const parentsData =
          await getParents();

        const busesData =
          await getBuses();

        const routesData =
          await getRoutes();

        setParents(
          parentsData.parents
        );

        setBuses(
          busesData.buses
        );

        setRoutes(
          routesData.routes
        );
      };

    if (open && student) {

      loadData();

      setFormData({
        admissionNumber:
          student.admissionNumber || "",
        name:
          student.name || "",

        className:
          student.className || "",

        parentId:
          student.parentId?._id || "",

        busId:
          student.busId?._id || "",

        routeId:
          student.routeId?._id || "",  
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
          label="Admission Number"
          name="admissionNumber"
          value={formData.admissionNumber}
          onChange={handleChange}
          margin="normal"
        />

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

        <Autocomplete
          options={parents}
          getOptionLabel={(option) =>
          `${option.name} (${option.phone})`
          }
          value={
            parents.find(
              (parent) =>
                parent._id === formData.parentId
            ) || null
          }
          onChange={(event, value) =>
            setFormData({
              ...formData,
              parentId: value?._id || "",
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Parent"
              margin="normal"
              fullWidth
            />
          )}
/>


        <Autocomplete
      options={routes}
      getOptionLabel={(option) =>
        `${option.routeName}
        (${option.stops
          ?.map(
            stop =>
            stop.stopName
          )
          .join(" → ")})`
      }

      onChange={
        async (_, value) => {

          setFormData({
            ...formData,
            routeId:
              value?._id || "",
          });

          if (value?.stops) {

          const filteredStops =
            value.stops.slice(
              1,
              value.stops.length - 1
            );

          setRouteStops(
            filteredStops
          );

        }

          if (value?._id) {

            const data =
              await getBusesByRoute(
                value._id
              );

            setRouteBuses(
              data.buses
            );

          }

        }
      }

      renderInput={(params) => (
        <TextField
          {...params}
          label="Route"
          margin="normal"
          fullWidth
        />
      )}
    />

       <Autocomplete
          options={routeBuses}
          getOptionLabel={(option) =>
            option.busNumber || ""
          }
          value={
            routeBuses.find(
              (bus) =>
                bus._id === formData.busId
            ) || null
          }
          onChange={(event, value) =>
            setFormData({
              ...formData,
              busId: value?._id || "",
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Bus"
              margin="normal"
              fullWidth
            />
          )}
        />


       <Autocomplete
        options={routeStops}

        getOptionLabel={
          (option) =>
            option.stopName
        }

        onChange={
          (_, value) =>

            setFormData({
              ...formData,

              pickupStop:
                value?.stopName ||
                "",
            })
        }

        renderInput={
          (params) => (

            <TextField
              {...params}
              label="Pickup Stop"
              margin="normal"
              fullWidth
            />

          )
        }
      />

 

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