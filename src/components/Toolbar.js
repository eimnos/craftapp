import { Box, Button } from "@mui/material";

function Toolbar({ buttons }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 2,
        padding: 2,

      }}
    >
      {buttons.map((button, index) => (
        <Button key={index} variant="contained" onClick={button.onClick} sx={{ mr: 1 , color: "#36535a", fontWeight: "bold" }}> 
          {button.label}
        </Button>
      ))}
    </Box>
  );
}

export default Toolbar;