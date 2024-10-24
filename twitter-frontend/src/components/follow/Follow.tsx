import { useEffect, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  IconButton,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate, useParams } from "react-router-dom";


import SideView from "../../components/sideview/Sideview";
import { IPage, IUser } from "../../types/interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks/customReduxHooks";
import { RootState } from "../../store/store";
import { fetchFollowers, fetchFollowings, fetchUser } from "../../store/slices/userSlice";

const initPage: IPage = {
  page: 1,
  limit: 10
};

const Follow = () => {
  const {
    user,
    loading,
    error,
    followers,
    followersLoading,
    followersError,
    followings,
    followingsLoading,
    followingsError,
  } = useAppSelector((store: RootState) => store.user);

  const navigate = useNavigate();
  const location = useLocation();
  const tabPaths = [`followings`, `followers`];
  const [activeTabValue, setActiveTabValue] = useState(() => {
    const paths = location.pathname.split("/");
    const currentTab = tabPaths.indexOf(paths[paths.length - 1]);
    if (currentTab !== -1) {
      return currentTab;
    } else {
      return 0;
    }
  });
  const [followersPage, setFollowersPage ] = useState<IPage>(initPage);
  const [ followingsPage, setFollowingsPage ] = useState<IPage>(initPage);

  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    if (!user) {
      const { username } = params;
      if (username) {
        dispatch(fetchUser(username));
      }
    }
    if (user) {
      dispatch(fetchFollowings({
        userId: user?.id as string,
        iPage: followingsPage
      }));
    }
  }, [dispatch, user]);

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
      dispatch(fetchFollowings({
        userId: user?.id as string,
        iPage: followingsPage
      }));
    } else {
      dispatch(fetchFollowers({
        userId: user?.id as string,
        iPage: followersPage
      }));
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ display: "flex" }}>
        <SideView />
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
              {loading ? (
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ width: "100px" }}
                />
              ) : (
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  {user?.firstName} {user?.lastName}
                </span>
              )}
              {loading ? (
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ width: "100px" }}
                />
              ) : (
                <span>
                  {" "}
                  {user?.tweetsCount} {user?.tweetsCount ? "posts" : "post"}
                </span>
              )}
            </Box>
          </Box>
          <Box sx={{ flex: "0 0 100%" }}>
            <Tabs
              value={activeTabValue}
              onChange={handleChange}
              aria-label="tabs"
              variant="fullWidth"
            >
              <Tab label="Followings" sx={{ textTransform: "none" }} />
              <Tab label="Followers" sx={{ textTransform: "none" }} />
            </Tabs>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Follow;
