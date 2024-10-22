import { useEffect, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import apiClient from "../../hooks/apiCaller";
import SideView from "../../components/sideview/Sideview";
import { IUser } from "../../types/interfaces";
import { useLocation, useNavigate } from "react-router-dom";

const Follow = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [ followers, setFollowers ] = useState<IUser []>([]);
  const [ followings, setFollowings ] = useState<IUser []>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const tabPaths = [`followers`, `followings`];
  const [activeTabValue, setActiveTabValue] = useState(() => {
    const paths = location.pathname.split("/");
    const currentTab = tabPaths.indexOf(paths[paths.length - 1]);
    if (currentTab !== -1) {
      return currentTab;
    } else {
      return 0;
    }
  });

  const getFollowers = async () => {
    try {
      const { data } = await apiClient.get(`/follow/${user?.id}/followers`);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const getFollowings = async () => {
    try {
      const { data } = await apiClient.get(`/follow/${user?.id}/followings`);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await apiClient.get("/user");
      setUser(data?.user);
    };
    try {
      getUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(()=> {
    if(user){
      if (activeTabValue === 0) {
        getFollowers();
      } else {
        getFollowings();
      }
    }
  }, [user])

  useEffect(() => {
    const currentTab = tabPaths.indexOf(location.pathname);
    if (currentTab !== -1) {
      setActiveTabValue(currentTab);
    }
  }, [location.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabValue(newValue);
    navigate(`/${user?.username}/${tabPaths[newValue]}`);
    if (newValue === 0) {
      getFollowers();
    } else {
      getFollowings();
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ display: "flex" }}>
        <SideView user={user} />
        <Box
          sx={{ display: "flex", width: "inherit", flexDirection: "column" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              marginTop: 1,
            }}
          >
            <Tooltip title="Back">
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {user && (
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  {user?.firstName} {user?.lastName}
                </span>
              )}
              <span> 0 post</span>
            </Box>
          </Box>
          <Box sx={{ flex: "0 0 100%" }}>
            <Tabs
              value={activeTabValue}
              onChange={handleChange}
              aria-label="tabs"
              variant="fullWidth"
            >
              <Tab label="Followers" sx={{ textTransform: "none" }} />
              <Tab label="Followings" sx={{ textTransform: "none" }} />
            </Tabs>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Follow;
