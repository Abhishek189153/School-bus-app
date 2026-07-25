import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
} from "@mui/material";

export default function SchoolAdminDetails({

  open,

  admin,

  onClose,

}) {

  if (!admin) return null;

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>

        School Admin Details

      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={2}
          mt={1}
        >

          <Grid item xs={6}>

            <Typography fontWeight="bold">
              Name
            </Typography>

            <Typography>

              {admin.name}

            </Typography>

          </Grid>

          <Grid item xs={6}>

            <Typography fontWeight="bold">
              School
            </Typography>

            <Typography>

              {admin.schoolId?.schoolName}

            </Typography>

          </Grid>

          <Grid item xs={6}>

            <Typography fontWeight="bold">
              Phone
            </Typography>

            <Typography>

              {admin.phone}

            </Typography>

          </Grid>

          <Grid item xs={6}>

            <Typography fontWeight="bold">
              Email
            </Typography>

            <Typography>

              {admin.email}

            </Typography>

          </Grid>

          <Grid item xs={6}>

            <Typography fontWeight="bold">
              Account Status
            </Typography>

            <Chip

              label={
                admin.isFirstLogin
                  ? "Pending Setup"
                  : "Active"
              }

              color={
                admin.isFirstLogin
                  ? "warning"
                  : "success"
              }

            />

          </Grid>

          <Grid item xs={6}>

            <Typography fontWeight="bold">
              Created
            </Typography>

            <Typography>

              {new Date(
                admin.createdAt
              ).toLocaleDateString()}

            </Typography>

          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>

          Close

        </Button>

      </DialogActions>

    </Dialog>

  );

}