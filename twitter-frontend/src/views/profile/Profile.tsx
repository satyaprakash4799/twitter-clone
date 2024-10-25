import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EggIcon from "@mui/icons-material/Egg";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import {useSelector} from "react-redux";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InfiniteScroll from "react-infinite-scroller";

import SideView from "../../components/sideview/Sideview";
import {RootState} from "../../store/store";
import {useEffect, useState} from "react";
import {fetchTweets, fetchUser} from "../../store/slices/userSlice";
import {useAppDispatch} from "../../hooks/customReduxHooks";
import Loader from "../../hooks/loader";
import {IPage, ITweet} from "../../types/interfaces";
import './profile.css';

const initPage: IPage = {
  limit: 10,
  page: 1,
};

const Profile = () => {
  const [tweetPage, setTweetPage] = useState<IPage>(initPage);
  const dispatch = useAppDispatch();
  const {
    user,
    loading,
    error: _error,
    tweets,
    tweetsError,
    loadingTweets,
  } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate("/home");
  };

  useEffect(() => {
    const {username} = params;
    if (!user && username) {
      dispatch(fetchUser(username));
    }
  }, [dispatch, user, location.pathname]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTweets({userId: user?.id as string, iPage: tweetPage}));
    }
  }, [dispatch, user, tweetPage]);

  return (
    <>
      <CssBaseline/>
      <Container maxWidth="lg" sx={{display: "flex"}}>
        <SideView/>
        <Box
          sx={{display: "flex", width: "inherit", flexDirection: "column"}}
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
                <ArrowBackIcon/>
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
                    sx={{width: "100px"}}
                  />
                </Box>
              ) : (
                <Typography style={{fontWeight: "bold"}}>
                  {user?.firstName} {user?.lastName}
                </Typography>
              )}
              <span>
                {loading ? (
                  <Box typography="span">
                    <Skeleton
                      animation="wave"
                      variant="text"
                      sx={{width: "100px"}}
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
          <Box sx={{height: "100px", margin: 1}}>
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
                  sx={{width: "100px"}}
                />
              ) : (
                <Box typography={"span"} sx={{fontWeight: "bold"}}>
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
                sx={{width: "100px"}}
              />
            ) : (
              <Box typography={"span"} sx={{color: "rgb(83, 100, 113)"}}>
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
                    sx={{width: "100px"}}
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
                <EggIcon/>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{width: "100px"}}
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
                <CalendarMonthIcon/>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{width: "100px"}}
                  />
                ) : (
                  <Box typography={"span"}>
                    {" "}
                    Joined {moment(user?.createdAt).format("MMMM YYYY")}
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{display: "flex", flexDirection: "row", gap: 3}}>
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
                    sx={{width: "10px"}}
                  />
                ) : (
                  <Box typography={"span"} sx={{fontWeight: 800}}>
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
                    sx={{width: "10px"}}
                  />
                ) : (
                  <Box typography={"span"} sx={{fontWeight: 800}}>
                    {user?.followersCount}
                  </Box>
                )}
                <Box typography={"span"} color={"rgb(83, 100, 113)"}>
                  Followers
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{margin: 2}}>
            <List>
              {/* <InfiniteScroll
                pageStart={0}
                loadMore={() => {}}
                hasMore={true}
                loader={<Loader type="circular" />}
              >
                {tweets.tweets.map((tweet, index) => {
                  return <ListItem key={index}>{tweet.content}</ListItem>;
                })}
              </InfiniteScroll> */}
              {tweets.tweets.map((tweet, index) => {
                return <TweetItem key={tweet.id} tweet={tweet}></TweetItem>;
              })}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
};

interface TweetItemPros {
  tweet: ITweet;
}

const TweetItem = (props: TweetItemPros) => {
  const {tweet} = props;
  return (
    <Box
      sx={{display: "flex", flexDirection: "row", height: "200px", gap: 2}}
    >
      <Box>
        <Avatar src={tweet?.user?.userProfile?.userImage as string}/>
      </Box>
      <Box sx={{display: "flex", flexDirection: "column", flex: '0 0 50%'}}>
        <Box sx={{display: "flex", flexDirection: "row", gap: 1,}}>
          <Box typography={"span"} sx={{fontWeight: "bold"}}>
            {tweet.user?.firstName} {tweet.user?.lastName}
          </Box>
          <Box typography={"span"}>@{tweet?.user?.username}</Box>
          <Box typography={"span"}>
            <Tooltip title={moment(tweet?.createdAt).format("hh:mm:ss a MMM DD, YYYY")} arrow>
              <span>{moment(tweet.createdAt).format("MMM DD")}</span>
            </Tooltip>
          </Box>
        </Box>
        <Box typography={'span'} sx={{marginTop: 1, marginBottom: 1}}>
          {tweet.content}
        </Box>

          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Tooltip title="Reply" arrow>
              <Box sx={{display: 'flex', flexDirection: 'row', gap:1,cursor: 'pointer', alignItems: 'center'}}>
                <IconButton><ChatBubbleOutlineIcon/></IconButton>
                <Box typography={"body1"}>{tweet?.replyCount}</Box>
              </Box>
            </Tooltip>
            <Tooltip title={"Repost"}>
              <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, cursor: 'pointer', alignItems: 'center'}}>
                <IconButton><AutorenewIcon/></IconButton>
                <Box typography={"body1"}>{tweet?.shareCount}</Box>
              </Box>
            </Tooltip>
            <Tooltip title={"Like"}>
              <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, cursor: 'pointer', alignItems: 'center'}}>
                <IconButton><FavoriteBorderIcon/></IconButton>
                <Box typography={"body1"}>{tweet?.likesCount}</Box>
              </Box>
            </Tooltip>
          </Box>

      </Box>
    </Box>
  );
};

export default Profile;