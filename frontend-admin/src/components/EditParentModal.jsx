import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import {
  useState,
  useEffect,
} from "react";

import {
  updateParent,
} from "../services/parent.service";


const EditParentModal = ({
  open,
  handleClose,
  parent,
  refreshParents,
}) => {

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
    });


  // ==========================================
  // LOAD PARENT DATA
  // ==========================================

  useEffect(() => {

    if (parent) {

      setFormData({

        name:
          parent.name || "",

        email:
          parent.email || "",

        phone:
          parent.phone || "",

      });

    }

  }, [parent]);


  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        name === "email"
          ? value.toLowerCase()
          : value,

    }));

  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit =
    async () => {

      // Basic validation

      if (
        !formData.name.trim()
      ) {

        alert(
          "Parent name is required"
        );

        return;

      }


      if (
        !formData.email.trim()
      ) {

        alert(
          "Email is required"
        );

        return;

      }


      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email.trim()
        )
      ) {

        alert(
          "Enter a valid email address"
        );

        return;

      }


      if (
        !/^\d{10}$/.test(
          formData.phone.trim()
        )
      ) {

        alert(
          "Enter a valid 10-digit phone number"
        );

        return;

      }


      try {

        await updateParent(
          parent._id,
          formData
        );

        refreshParents();

        handleClose();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Operation failed"
        );

      }

    };


  return (

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >

      <DialogTitle>
        Edit Parent
      </DialogTitle>


      <DialogContent>

        {/* NAME */}

        <TextField
          fullWidth
          label="Name"
          name="name"
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />


        {/* EMAIL */}

        <TextField
          fullWidth
          type="email"
          label="Email"
          name="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          helperText="Used for password recovery"
        />


        {/* PHONE */}

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
          inputProps={{
            maxLength: 10,
            inputMode: "numeric",
          }}
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


export default EditParentModal;