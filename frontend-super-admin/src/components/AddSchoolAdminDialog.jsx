import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";

import {
  useState,
  useEffect,
} from "react";

import axios from "../api/axios";

import {
  createSchoolAdmin,
} from "../services/schoolAdmin.service";

export default function AddSchoolAdminDialog({
  open,
  onClose,
  onSuccess,
}) {

  const [schools, setSchools] = useState([]);

  const [form, setForm] = useState({

    schoolId: "",

    name: "",

    phone: "",

    email: "",

    password: "",

  });

  useEffect(() => {

    if (open) {

      loadSchools();

    }

  }, [open]);

  const loadSchools = async () => {

    try {

      const res = await axios.get("/schools");

      setSchools(res.data.schools);

    } catch (err) {

      console.log(err);

    }

  };

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };

  const generatePassword = () => {

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

    let password = "SBM@";

    for (let i = 0; i < 6; i++) {

      password += chars.charAt(

        Math.floor(
          Math.random() * chars.length
        )

      );

    }

    setForm({

      ...form,

      password,

    });

  };

  const handleSubmit = async () => {

    try {

      await createSchoolAdmin(form);

      onSuccess();

      onClose();

      setForm({

        schoolId: "",

        name: "",

        phone: "",

        email: "",

        password: "",

      });

    } catch (err) {

      alert(

        err.response?.data?.message ||

        "Unable to create School Admin"

      );

    }

  };

  return (

    <Dialog

      open={open}

      onClose={onClose}

      fullWidth

      maxWidth="sm"

    >

      <DialogTitle>

        Add School Admin

      </DialogTitle>

      <DialogContent>

        <Grid

          container

          spacing={2}

          mt={1}

        >

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

          <Grid item xs={12}>

            <TextField

              fullWidth

              label="Admin Name"

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

          <Grid item xs={9}>

            <TextField

              fullWidth

              label="Temporary Password"

              name="password"

              value={form.password}

              onChange={handleChange}

            />

          </Grid>

          <Grid

            item

            xs={3}

            display="flex"

            alignItems="center"

          >

            <Button

              variant="outlined"

              fullWidth

              onClick={generatePassword}

            >

              Generate

            </Button>

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

          Save

        </Button>

      </DialogActions>

    </Dialog>

  );

}