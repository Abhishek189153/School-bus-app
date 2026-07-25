import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";

import {
  updateSchoolAdmin,
} from "../services/schoolAdmin.service";

export default function EditSchoolAdminDialog({

  open,

  admin,

  onClose,

  onSuccess,

}) {

  const [schools, setSchools] = useState([]);

  const [form, setForm] = useState({

    name: "",

    phone: "",

    email: "",

    schoolId: "",

  });

  useEffect(() => {

    if (open) {

      loadSchools();

    }

  }, [open]);

  useEffect(() => {

    if (admin) {

      setForm({

        name: admin.name,

        phone: admin.phone,

        email: admin.email,

        schoolId: admin.schoolId?._id,

      });

    }

  }, [admin]);

  const loadSchools = async () => {

    const res = await axios.get("/schools");

    setSchools(res.data.schools);

  };

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async () => {

    try {

      await updateSchoolAdmin(

        admin._id,

        form

      );

      onSuccess();

      onClose();

    } catch (err) {

      alert(

        err.response?.data?.message ||

        "Unable to update."

      );

    }

  };

  if (!admin) return null;

  return (

    <Dialog

      open={open}

      onClose={onClose}

      fullWidth

      maxWidth="sm"

    >

      <DialogTitle>

        Edit School Admin

      </DialogTitle>

      <DialogContent>

        <Grid

          container

          spacing={2}

          mt={1}

        >

          <Grid item xs={12}>

            <TextField

              fullWidth

              label="Name"

              name="name"

              value={form.name}

              onChange={handleChange}

            />

          </Grid>

          <Grid item xs={6}>

            <TextField

              fullWidth

              label="Phone"

              name="phone"

              value={form.phone}

              onChange={handleChange}

            />

          </Grid>

          <Grid item xs={6}>

            <TextField

              fullWidth

              label="Email"

              name="email"

              value={form.email}

              onChange={handleChange}

            />

          </Grid>

          <Grid item xs={12}>

            <TextField

              select

              fullWidth

              label="School"

              name="schoolId"

              value={form.schoolId}

              onChange={handleChange}

            >

              {

                schools.map(

                  (school) => (

                    <MenuItem

                      key={school._id}

                      value={school._id}

                    >

                      {school.schoolName}

                    </MenuItem>

                  )

                )

              }

            </TextField>

          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button

          onClick={onClose}

        >

          Cancel

        </Button>

        <Button

          variant="contained"

          onClick={handleSubmit}

        >

          Save Changes

        </Button>

      </DialogActions>

    </Dialog>

  );

}