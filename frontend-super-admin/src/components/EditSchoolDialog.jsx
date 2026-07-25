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
useEffect,
} from "react";

import axios
from "../api/axios";

export default function EditSchoolDialog({

open,

school,

onClose,

onSuccess,

}){

const [form,setForm]=
useState({});

useEffect(()=>{

if(school){

setForm(school);

}

},[school]);

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:
e.target.value,

});

};

const handleUpdate=async()=>{

await axios.put(

`/schools/${school._id}`,

form

);

onSuccess();

onClose();

};

if(!school)
return null;

return(

<Dialog

open={open}

onClose={onClose}

fullWidth

maxWidth="sm"

>

<DialogTitle>

Edit School

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

value={
form.schoolName||""
}

onChange={
handleChange
}

/>

</Grid>

<Grid item xs={12}>

<TextField

fullWidth

label="Address"

name="address"

value={
form.address||""
}

onChange={
handleChange
}

/>

</Grid>

<Grid item xs={6}>

<TextField

fullWidth

label="Phone"

name="phone"

value={
form.phone||""
}

onChange={
handleChange
}

/>

</Grid>

<Grid item xs={6}>

<TextField

fullWidth

label="Email"

name="email"

value={
form.email||""
}

onChange={
handleChange
}

/>

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

onClick={handleUpdate}

>

Update

</Button>

</DialogActions>

</Dialog>

);

}