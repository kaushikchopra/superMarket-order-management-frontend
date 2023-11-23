import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const subtitleJSX = (
    <>
      <span>
        Click on the <span style={{ fontWeight: "bold" }}>ORDER NUMBER</span>{" "}
        for detail summary
      </span>
    </>
  );

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ mb: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle !== "Click on the ORDER NUMBER for detail summary"
          ? subtitle
          : subtitleJSX}
      </Typography>
    </Box>
  );
};

export default Header;
