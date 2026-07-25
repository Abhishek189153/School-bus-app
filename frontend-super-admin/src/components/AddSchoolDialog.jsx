import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

import {
  useState,
} from "react";

import axios
from "../api/axios";

export default function AddSchoolDialog({
  open,
  onClose,
  onSuccess,
}) {

  const [form, setForm] = useState({

    // School Details
    schoolName: "",
    address: "",
    phone: "",
    email: "",

    // // School Admin Details
    // adminName: "",
    // adminPhone: "",
    // adminEmail: "",
    // temporaryPassword: "",

});

  const handleChange=(e)=>{

    setForm({

      ...form,

      [e.target.name]:
      e.target.value,

    });

  };


//   const generatePassword = () => {

//     const chars =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

//     let password = "SBM@";

//     for (let i = 0; i < 6; i++) {

//         password += chars.charAt(
//             Math.floor(Math.random() * chars.length)
//         );

//     }

//     setForm((prev) => ({
//         ...prev,
//         temporaryPassword: password,
//     }));

// };

  const handleSubmit=async()=>{

    try{

      await axios.post(
        "/schools",
        form
      );

      onSuccess();

      onClose();

      setForm({

        schoolName:"",
        address:"",
        phone:"",
        email:"",

        // adminName: "",
        // adminPhone: "",
        // adminEmail: "",
        // temporaryPassword: "",


      });

    }catch(err){

      alert(
        err.response?.data?.message
      );

    }

  };

  return(

<Dialog
open={open}
onClose={onClose}
maxWidth="sm"
fullWidth
>

<DialogTitle>

Add School

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

label="School Name"

name="schoolName"

value={form.schoolName}

onChange={handleChange}

/>

</Grid>

<Grid item xs={12}>

<TextField

fullWidth

label="Address"

name="address"

value={form.address}

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

{/* <Grid item xs={12}>
    <h3>School Admin Information</h3>
</Grid>

<Grid item xs={6}>
    <TextField
        fullWidth
        label="Admin Name"
        name="adminName"
        value={form.adminName}
        onChange={handleChange}
    />
</Grid>

<Grid item xs={6}>
    <TextField
        fullWidth
        label="Admin Phone"
        name="adminPhone"
        value={form.adminPhone}
        onChange={handleChange}
    />
</Grid>

<Grid item xs={12}>
    <TextField
        fullWidth
        label="Admin Email"
        name="adminEmail"
        value={form.adminEmail}
        onChange={handleChange}
    />
</Grid>

<Grid item xs={9}>
    <TextField
        fullWidth
        label="Temporary Password"
        name="temporaryPassword"
        value={form.temporaryPassword}
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

</Grid> */}

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