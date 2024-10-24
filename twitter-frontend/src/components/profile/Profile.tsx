import {
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EggIcon from "@mui/icons-material/Egg";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { useSelector } from "react-redux";

import SideView from "../sideview/Sideview";
import { RootState } from "../../store/store";
import { useEffect } from "react";
import { fetchUser } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../hooks/customReduxHooks";
import Loader from "../../hooks/loader";

const Profile = () => {
  const dispatch = useAppDispatch();
  const {
    user,
    loading,
    error: _error,
  } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate("/home");
  };

  useEffect(() => {
    const { username } = params;
    if (!user && username) {
      dispatch(fetchUser(username));
    }
  }, [dispatch, location.pathname]);

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
              <IconButton onClick={navigateToHomepage}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              {loading ? (
                <Box typography="span">
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ width: "100px" }}
                  />
                </Box>
              ) : (
                <Typography style={{ fontWeight: "bold" }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
              )}
              <span>
                {loading ? (
                  <Box typography="span">
                    <Skeleton
                      animation="wave"
                      variant="text"
                      sx={{ width: "100px" }}
                    />
                  </Box>
                ) : (
                  <Box typography={"span"}>
                    {user?.tweetsCount} {user?.tweetsCount ? "posts" : "post"}
                  </Box>
                )}
              </span>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgb(207, 217, 222)",
              height: "200px",
            }}
          ></Box>
          <Box sx={{ height: "100px", margin:1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {loading ? (
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ width: "100px" }}
                />
              ) : (
                <Box typography={"span"} sx={{ fontWeight: "bold" }}>
                  {user?.firstName} {user?.lastName}{" "}
                </Box>
              )}

              <Button
                startIcon={
                  <CheckCircleIcon
                    sx={{
                      color: "#1976d2",
                    }}
                  />
                }
                sx={{
                  color: "#000",
                  textTransform: "none",
                  borderRadius: "10px",
                  border: "1px solid rgb(207, 217, 222)",
                }}
                size="small"
              >
                Get verified
              </Button>
            </Box>
            {loading ? (
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ width: "100px" }}
              />
            ) : (
              <Box typography={"span"} sx={{ color: "rgb(83, 100, 113)" }}>
                @{user?.username}
              </Box>
            )}
            <Box
              sx={{
                color: "rgb(83, 100, 113)",
                marginTop: 1,
                marginBottom: 1,
                display: "flex",
                flexDirection: "row",
                gap: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <LocationOnIcon></LocationOnIcon>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ width: "100px" }}
                  />
                ) : (
                  <Box typography={"span"}>{user?.userProfile?.address}</Box>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <EggIcon />
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ width: "100px" }}
                  />
                ) : (
                  <Box typography={"span"}>
                    {" "}
                    Born{" "}
                    {moment(user?.userProfile?.dateOfBirth).format(
                      "MMMM D, YYYY"
                    )}
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <CalendarMonthIcon />
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ width: "100px" }}
                  />
                ) : (
                  <Box typography={"span"}>
                    {" "}
                    Joined {moment(user?.createdAt).format("MMMM YYYY")}
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  cursor: "pointer",
                  "&:hover": {
                    borderBottom: "1px solid #000",
                  },
                }}
                onClick={() => navigate(`/${user?.username}/followings`)}
              >
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ width: "10px" }}
                  />
                ) : (
                  <Box typography={"span"} sx={{ fontWeight: 800 }}>
                    {user?.followingsCount}
                  </Box>
                )}
                <Box typography={"span"} color={"rgb(83, 100, 113)"}>
                  Following
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  cursor: "pointer",
                  "&:hover": {
                    borderBottom: "1px solid #000",
                  },
                }}
                onClick={() => navigate(`/${user?.username}/followers`)}
              >
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ width: "10px" }}
                  />
                ) : (
                  <Box typography={"span"} sx={{ fontWeight: 800 }}>
                    {user?.followersCount}
                  </Box>
                )}
                <Box typography={"span"} color={"rgb(83, 100, 113)"}>
                  Followers
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Profile;
