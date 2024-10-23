import { Box, CircularProgress, LinearProgress } from "@mui/material";

enum LoaderTypeEnum {
  linear = "linear",
  circular = "circular",
}
interface LoaderProps {
  type: string;
}

const Loader = (props: LoaderProps) => {
  const { type = "circular" } = props;

  return (
    <Box sx={{ width: "100%" }}>
      {type === "linear" && <LinearProgress color='info'/>}
      {type === "circular" && <CircularProgress color="info" />}
    </Box>
  );
};

export default Loader;
