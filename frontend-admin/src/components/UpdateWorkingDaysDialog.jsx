import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import {
    updateWorkingDays,
} from "../services/workingDay.service";

export default function UpdateWorkingDaysDialog({

    open,

    handleClose,

    refresh,

    workingDays,

})
{

    const [form,setForm]=useState({});

    useEffect(()=>{

        if(workingDays){

            setForm({

                monday:workingDays.monday,

                tuesday:workingDays.tuesday,

                wednesday:workingDays.wednesday,

                thursday:workingDays.thursday,

                friday:workingDays.friday,

                saturday:workingDays.saturday,

                sunday:workingDays.sunday,

            });

        }

    },[workingDays]);



    const handleChange=(e)=>{

        setForm({

            ...form,

            [e.target.name]:
            e.target.checked,

        });

    };



    const handleSave=async()=>{

        await updateWorkingDays(form);

        refresh();

        handleClose();

    };



    return(

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
        >

            <DialogTitle>

                Working Days

            </DialogTitle>

            <DialogContent>

                <FormGroup>

                    {Object.keys(form).map(day=>(

                        <FormControlLabel

                            key={day}

                            control={

                                <Checkbox

                                    checked={form[day]}

                                    onChange={handleChange}

                                    name={day}

                                />

                            }

                            label={
                                day.charAt(0).toUpperCase()
                                +
                                day.slice(1)
                            }

                        />

                    ))}

                </FormGroup>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={handleClose}
                >

                    Cancel

                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                >

                    Save

                </Button>

            </DialogActions>

        </Dialog>

    );

}