import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

export default function SchoolDetails({
  open,
  onClose,
  school,
}) {

  if (!school) return null;

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>

        School Details

      </DialogTitle>

      <DialogContent>

        <Grid container spacing={2}>

          <Grid item xs={12}>
            <Typography fontWeight="bold">
              School Name
            </Typography>

            <Typography>
              {school.schoolName}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider/>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Phone
            </Typography>

            <Typography>
              {school.phone}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Email
            </Typography>

            <Typography>
              {school.email}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider/>
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight="bold">
              Address
            </Typography>

            <Typography>
              {school.address}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider/>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Subscription
            </Typography>

            <Typography>
              {school.subscriptionStatus}
            </Typography>
          </Grid>

        </Grid>

      </DialogContent>

    </Dialog>

  );

}