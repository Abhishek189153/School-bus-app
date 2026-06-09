import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete
} from "@mui/material";

import { useState, useEffect } from "react";

import { getParents } from "../services/parent.service";
import { getBuses } from "../services/bus.service";
import { createStudent } from "../services/student.service";
import {getRoutes} from "../services/route.service";
import {getBusesByRoute} from "../services/assignment.service";

const AddStudentModal = ({
  open,
  handleClose,
  refreshStudents,
}) => {

  const [parents, setParents] =
    useState([]);

  const [buses, setBuses] =
    useState([]);

  const [routes, setRoutes] =
  useState([]);

  const [routeBuses,setRouteBuses] =
  useState([]);

  const [routeStops,
setRouteStops] =
  useState([]);

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
        label="Admission Number"
        name="admissionNumber"
        margin="normal"
        onChange={handleChange}
        />

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

        <Autocomplete
          options={parents}
          getOptionLabel={(option) =>
            `${option.name} (${option.phone})`
          }
          onChange={(_, value) => {

            setFormData({
              ...formData,
              parentId:
                value?._id || "",
            });

          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Parent"
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
    `${option.busNumber} (${option.vehicleNumber})`
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
  filterOptions={(options, state) =>
    options.filter(
      (bus) =>
        bus.busNumber
          .toLowerCase()
          .includes(
            state.inputValue.toLowerCase()
          ) ||
        bus.vehicleNumber
          ?.toLowerCase()
          .includes(
            state.inputValue.toLowerCase()
          )
          )
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
          Save
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default AddStudentModal;