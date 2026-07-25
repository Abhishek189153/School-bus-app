import { Box } from "@mui/material";

export default function PageContainer({
  children,
}) {
  return (
    <Box
      sx={{
        p: 4,
        background: "#F5F7FB",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {children}
    </Box>
  );
}