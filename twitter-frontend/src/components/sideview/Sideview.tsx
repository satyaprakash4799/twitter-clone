import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

interface SideViewProps {
  user: any;
}
const SideView = (props: SideViewProps) => {
  const { user } = props;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          m: 1,
          p: 1,
          borderRight: "0.3px solid #80808021",
        }}
      >
        <IconButton>
          {" "}
          <XIcon fontSize="large" sx={{ color: "#000" }} />
        </IconButton>
        <Tooltip title="Home">
          <IconButton>
            {" "}
            <HomeIcon fontSize="medium" sx={{ color: "#000" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Explore">
          <IconButton>
            {" "}
            <SearchIcon fontSize="medium" sx={{ color: "#000" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Accounts">
          <Avatar
            sx={{ position: "absolute", bottom: "20px" }}
            src={user?.userProfile?.userImage}
          ></Avatar>
        </Tooltip>
      </Box>
    </>
  );
};

export default SideView;
