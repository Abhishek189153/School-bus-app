import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export default function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        height: 160,
        transition: ".3s",
        cursor: "pointer",
        border: "1px solid #EEF2F7",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,.08)",
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography
            color="text.secondary"
            fontWeight={600}
          >
            {title}
          </Typography>

          <Box
            sx={{
              background: color,
              width: 52,
              height: 52,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h3"
          mt={4}
          fontWeight="bold"
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}