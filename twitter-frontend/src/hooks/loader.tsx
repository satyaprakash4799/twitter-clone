import { Box, CircularProgress, LinearProgress } from "@mui/material";

export enum LoaderTypeEnum {
  linear = "linear",
  circular = "circular",
}
interface LoaderProps {
  type: LoaderTypeEnum;
}

const Loader = (props: LoaderProps) => {
  const { type = "circular" } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
      {type === "linear" && <LinearProgress color='info'/>}
      {type === "circular" && <CircularProgress color="info" />}
    </Box>
  );
};

export default Loader;
