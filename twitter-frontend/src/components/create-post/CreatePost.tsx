import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PublicIcon from "@mui/icons-material/Public";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import apiClient from "../../hooks/apiCaller";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../types/interfaces";
import { useAppSelector } from "../../hooks/customReduxHooks";
import { RootState } from "../../store/store";

interface CreatePostProps {}

enum SharedToType {
  EVERYONE = "everyone",
}

enum IReplyType {
  EVERYONE = "everyone",
  ACCOUNTS_YOU_FOLLOW = "accounts_you_follow",
  VERIFIED_ACCOUNTS = "verified_accounts",
  ONLY_ACCOUNTS_YOU_MENTIONED = "only_account_you_mentioned",
}
const CreatePost = (props: CreatePostProps) => {
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [content, setContent] = useState<string>("");
  const [sharedToType, setSharedToType] = useState<SharedToType>(
    SharedToType.EVERYONE
  );
  const [replyType, setReplyType] = useState<IReplyType>(IReplyType.EVERYONE);
  const maxTweetLength = 180;
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector(
    (state: RootState) => state.user
  );

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowMenu((prevValue) => {
      return !prevValue;
    });
    setMenuEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuEl(null);
    setShowMenu(false);
  };
  const handleContent = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const createPost = async () => {
    try {
      const createPostData = {
        userId: user?.id,
        content,
        sharedToType,
        replyType,
      };
      const { data } = await apiClient.post("/tweet", createPostData);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToProfile = () => {
    navigate(`/${user?.username}`);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          p: 2,
          display: "flex",
          flexDirection: "row",
          height: "100px",
        }}
      >
        <Divider />
        <Box sx={{ margin: 1, cursor: "pointer" }}>
          <Avatar
            src={user?.userProfile?.userImage as string}
            onClick={navigateToProfile}
          ></Avatar>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", m: 1, width: "100%" }}
        >
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              marginBottom: 2,
              width: "100px",
            }}
            onClick={handleButtonClick}
          >
            Everyone
          </Button>
          <Menu
            open={showMenu}
            anchorEl={menuEl}
            sx={{
              "& .MuiPaper-root": {
                padding: 1,
                borderRadius: "10px",
                width: "200px",
                height: "300px",
              },
            }}
            onClose={handleMenuClose}
          >
            <Box typography="h6">Choose audience</Box>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PublicIcon sx={{ color: "rgb(29, 155, 240)" }} />
              </ListItemIcon>
              <Typography variant="inherit">Everyone</Typography>
              <ListItemIcon
                sx={{
                  marginLeft: "auto",
                }}
              >
                <CheckIcon
                  fontSize="small"
                  sx={{ color: "rgb(29, 155, 240)" }}
                />
              </ListItemIcon>
            </MenuItem>
          </Menu>
          <TextField
            placeholder="What is happening?!"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root input": {
                padding: 0,
              },
              "& fieldset": {
                border: 0,
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                border: 0,
              },
            }}
            value={content}
            onChange={handleContent}
            multiline
            slotProps={{
              htmlInput: {
                maxLength: maxTweetLength,
              },
            }}
          ></TextField>
          <Button
            variant="text"
            sx={{
              textTransform: "none",
              color: "rgb(29, 155, 240)",
              borderRadius: "15px",
              marginTop: 2,
              marginBottom: 2,
              justifyContent: "flex-start",
              width: "170px",
            }}
            startIcon={<PublicIcon sx={{ color: "rgb(29, 155, 240)" }} />}
          >
            Everyone can reply
          </Button>
          <Divider />
          <Box sx={{ marginTop: 1, marginBottom: 1 }}>
            <Stack
              sx={{
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "10px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              { content.length > 0  && (
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    thickness={5}
                    size="25px"
                    sx={{ color: "#e0e0e0" }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={(content.length / maxTweetLength) * 100}
                    thickness={5}
                    size="25px"
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                    }}
                  />
                </Box>
              )}

              <Button
                sx={{
                  width: "20px",
                  borderRadius: "10px",
                  backgroundColor: "rgb(29, 155, 240)",
                  color: "#fff",
                  "&.Mui-disabled": {
                    backgroundColor: "rgb(29, 155, 240)",
                    opacity: "0.5",
                    color: "#fff",
                  },
                }}
                disabled={!content.length}
                onClick={createPost}
              >
                Post
              </Button>
            </Stack>
          </Box>
        </Box>
        <Divider />
      </Box>
    </>
  );
};

export default CreatePost;
