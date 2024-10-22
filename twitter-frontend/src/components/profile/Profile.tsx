import {
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EggIcon from "@mui/icons-material/Egg";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";

import apiClient from "../../hooks/apiCaller";
import { IUser } from "../../types/interfaces";
import SideView from "../sideview/Sideview";

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await apiClient.get("/user");
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [location.pathname]);

  const navigateToHomepage = () => {
    navigate("/home");
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
              <IconButton onClick={navigateToHomepage}>
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
          <Box
            sx={{
              backgroundColor: "rgb(207, 217, 222)",
              height: "200px",
            }}
          ></Box>
          <Box sx={{ height: "100px", marginLeft: 1, marginTop: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 800 }}>
                {user?.firstName} {user?.lastName}{" "}
              </span>
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
            <Box typography={"span"} sx={{ color: "rgb(83, 100, 113)" }}>
              @{user?.username}
            </Box>
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
                  gap: "5px",
                }}
              >
                <LocationOnIcon></LocationOnIcon>
                <Box typography={"span"}>{user?.userProfile?.address}</Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                }}
              >
                <EggIcon />
                <Box typography={"span"}>
                  {" "}
                  Born{" "}
                  {moment(user?.userProfile?.dateOfBirth).format(
                    "MMMM D, YYYY"
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                }}
              >
                <CalendarMonthIcon />
                <Box typography={"span"}>
                  {" "}
                  Joined {moment(user?.createdAt).format("MMMM YYYY")}
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": {
                    borderBottom: "1px solid #000",
                  },
                }}
                onClick={() => navigate(`/${user?.username}/followers`)}
              >
                <Box typography={"span"} sx={{ fontWeight: 800 }}>
                  {user?.followingsCount}
                </Box>
                <Box typography={"span"} color={"rgb(83, 100, 113)"}>
                  Following
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": {
                    borderBottom: "1px solid #000",
                  },
                }}
                onClick={() => navigate(`/${user?.username}/followings`)}
              >
                <Box typography={"span"} sx={{ fontWeight: 800 }}>
                  {user?.followersCount}
                </Box>
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
