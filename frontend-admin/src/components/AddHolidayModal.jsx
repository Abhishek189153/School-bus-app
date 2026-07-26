import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { useState, useEffect } from "react";

import { createHoliday } from "../services/holiday.service";

const AddHolidayModal = ({
  open,
  handleClose,
  refreshHolidays,
}) => {

  const [formData, setFormData] = useState({
    title: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (open) {

      setFormData({
        title: "",
        date: "",
      });

    }

  }, [open]);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async () => {

    if (!formData.title.trim()) {

      alert("Please enter holiday name.");

      return;

    }

    if (!formData.date) {

      alert("Please select holiday date.");

      return;

    }

    try {

      setLoading(true);

      await createHoliday(formData);

      refreshHolidays();

      handleClose();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to create holiday."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        Add Holiday
      </DialogTitle>

      <DialogContent>

        <TextField
          margin="normal"
          fullWidth
          label="Holiday Name"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Holiday Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
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
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default AddHolidayModal;