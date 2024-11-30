import {Avatar, Box, IconButton, Tooltip} from "@mui/material";
import XIcon from "@mui/icons-material/X";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import {useSelector} from "react-redux";


import {useEffect} from "react";
import {fetchCurrentUser} from "../../store/slices/userSlice";
import {useAppDispatch} from "../../hooks/customReduxHooks";
import {RootState} from "../../store/store";
import {useNavigate} from "react-router-dom";

interface SideViewProps {
}

const SideView = (props: SideViewProps) => {
  const dispatch = useAppDispatch();
  const {user} = useSelector((state: RootState) => state.currentUser);
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch])
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
        <IconButton onClick={() => navigate('/home')}>
          {" "}
          <XIcon fontSize="large" sx={{color: "#000"}}/>
        </IconButton>
        <Tooltip title="Home">
          <IconButton onClick={() => navigate('/home')}>
            {" "}
            <HomeIcon fontSize="medium" sx={{color: "#000"}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Explore">
          <IconButton>
            {" "}
            <SearchIcon fontSize="medium" sx={{color: "#000"}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Accounts">
          <Avatar
            sx={{position: "absolute", bottom: "20px"}}
            src={user?.userProfile?.userImage as string}
          ></Avatar>
        </Tooltip>
      </Box>
    </>
  );
};

export default SideView;
