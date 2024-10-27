import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PublicIcon from "@mui/icons-material/Public";
import {useState} from "react";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import {useNavigate} from "react-router-dom";


import {useAppDispatch, useAppSelector} from "../../hooks/customReduxHooks";
import {RootState} from "../../store/store";
import {createTweet} from "../../store/slices/userSlice";
import {IReplyType, ISharedToType, ITweet} from "../../types/interfaces";
import {LoadingButton} from "@mui/lab";
import {toCapitalize} from "../../utils/utils";

interface CreatePostProps {
}


const CreatePost = (props: CreatePostProps) => {
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showReplyMenu, setShowReplyMenu] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [sharedToType, setSharedToType] = useState<ISharedToType>(ISharedToType.EVERYONE);
  const [replyType, setReplyType] = useState<IReplyType>(IReplyType.EVERYONE);
  const maxTweetLength = 180;
  const navigate = useNavigate();
  const {user, loading, error} = useAppSelector((state: RootState) => state.currentUser);

  const {loadingCreateTweet} = useAppSelector((state: RootState) => state.user)

  const dispatch = useAppDispatch();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowMenu((prevValue) => {
      return !prevValue;
    });
    setMenuEl(event.currentTarget);
  };

  const handleReplyButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowReplyMenu((prevValue) => {
      return !prevValue;
    });
    setMenuEl(event.currentTarget);
  };

  const handleReplyMenuClose = () => {
    setMenuEl(null);
    setShowReplyMenu(false);
  }

  const handleMenuClose = () => {
    setMenuEl(null);
    setShowMenu(false);
  };
  const handleContent = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleReplyType = (value: string) => {
    if (value === 'everyone'){
      setReplyType(IReplyType.EVERYONE);
    }
    else if(value === 'accounts_you_follow'){
      setReplyType(IReplyType.ACCOUNTS_YOU_FOLLOW)
    }
    else if(value === 'verified_accounts'){
      setReplyType(IReplyType.VERIFIED_ACCOUNTS)
    }
    else if(value === 'only_account_you_mentioned'){
      setReplyType(IReplyType.ONLY_ACCOUNTS_YOU_MENTIONED)
    }
    handleReplyMenuClose();

  }
  const handleCreatePost = async () => {
    const createPostData: ITweet = {
      userId: user?.id as string, content, sharedToType, replyType,
    };
    dispatch(createTweet(createPostData));
    setContent('')
  };

  const navigateToProfile = () => {
    navigate(`/${user?.username}`);
  };
  return (<>
    <Box
      sx={{
        width: "100%", p: 2, display: "flex", flexDirection: "row", height: "100px",
      }}
    >
      <Divider/>
      <Box sx={{margin: 1, cursor: "pointer"}}>
        <Avatar
          src={user?.userProfile?.userImage as string}
          onClick={navigateToProfile}
        ></Avatar>
      </Box>
      <Box
        sx={{display: "flex", flexDirection: "column", m: 1, width: "100%"}}
      >
        <Button
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon/>}
          size="small"
          sx={{
            textTransform: "none", borderRadius: "10px", marginBottom: 2, width: "100px",
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
              padding: 1, borderRadius: "10px", width: "200px", height: "300px",
            },
          }}
          onClose={handleMenuClose}
        >
          <Box typography="h6">Choose audience</Box>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <PublicIcon sx={{color: "rgb(29, 155, 240)"}}/>
            </ListItemIcon>
            <Typography variant="inherit">Everyone</Typography>
            <ListItemIcon
              sx={{
                marginLeft: "auto",
              }}
            >
              <CheckIcon
                fontSize="small"
                sx={{color: "rgb(29, 155, 240)"}}
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
            }, "& fieldset": {
              border: 0,
            }, "& .MuiOutlinedInput-root.Mui-focused fieldset": {
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
          }}
          onClick={handleReplyButtonClick}
          startIcon={<PublicIcon sx={{color: "rgb(29, 155, 240)"}}/>}
        >
          {toCapitalize(replyType)} can reply
        </Button>
        <Menu
          open={showReplyMenu}
          anchorEl={menuEl}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "10px",
              width: '350px',
            },
          }}
          onClose={handleReplyMenuClose}
        >
          <MenuList>
            <Box typography={'h6'} sx={{m: 1}}>
              Who can reply?
            </Box>
            <Box typography={"body2"} sx={{m: 1}}>
              Choose who can reply to this post. Anyone mentioned can always reply.
            </Box>
            <MenuItem sx={{gap: 1}} onClick={()=> handleReplyType('everyone')}>
              <ListItemIcon sx={{color: '#1976d2'}}>
                <PublicIcon fontSize={"large"}/>
              </ListItemIcon>
              <ListItemText>Everyone</ListItemText>
              { replyType === 'everyone' && <ListItemIcon sx={{color: '#1976d2'}}>
                <CheckIcon/>
              </ListItemIcon>}

            </MenuItem>
            <MenuItem sx={{gap: 1}} onClick={()=> handleReplyType('accounts_you_follow')}>
              <ListItemIcon sx={{color: '#1976d2'}}>
                <PersonIcon fontSize={"large"}/>
              </ListItemIcon>
              <ListItemText>Accounts you follow</ListItemText>
              { replyType === 'accounts_you_follow' && <ListItemIcon sx={{color: '#1976d2'}}>
                <CheckIcon/>
              </ListItemIcon>}
            </MenuItem>
            <MenuItem sx={{gap: 1}} onClick={()=> handleReplyType('verified_accounts')}>
              <ListItemIcon sx={{color: '#1976d2'}}>
                <CheckCircleIcon fontSize={"large"}/>
              </ListItemIcon>
              <ListItemText>Verified accounts</ListItemText>
              { replyType === 'verified_accounts'  && <ListItemIcon sx={{color: '#1976d2'}}>
                <CheckIcon/>
              </ListItemIcon>}
            </MenuItem>
            <MenuItem sx={{gap: 1}} onClick={()=> handleReplyType('only_account_you_mentioned')}>
              <ListItemIcon sx={{color: '#1976d2'}}>
                <AlternateEmailIcon fontSize={"large"}/>
              </ListItemIcon>
              <ListItemText>Only accounts you mention</ListItemText>
              { replyType === 'only_account_you_mentioned' && <ListItemIcon sx={{color: '#1976d2'}}>
                <CheckIcon/>
              </ListItemIcon>}
            </MenuItem>
          </MenuList>
        </Menu>
        <Divider/>
        <Box sx={{marginTop: 1, marginBottom: 1}}>
          <Stack
            sx={{
              justifyContent: "flex-end", alignItems: "center", gap: "10px", display: "flex", flexDirection: "row",
            }}
          >
            {content.length > 0 && (<Box sx={{position: "relative", display: "inline-flex"}}>
              <CircularProgress
                variant="determinate"
                value={100}
                thickness={5}
                size="25px"
                sx={{color: "#e0e0e0"}}
              />
              <CircularProgress
                variant="determinate"
                value={(content.length / maxTweetLength) * 100}
                thickness={5}
                size="25px"
                sx={{
                  position: "absolute", left: 0, top: 0,
                }}
              />
            </Box>)}
            <LoadingButton loading={loadingCreateTweet} loadingPosition={'center'}
                           sx={{
                             width: "20px",
                             borderRadius: "10px",
                             backgroundColor: "rgb(29, 155, 240)",
                             color: "#fff",
                             "&.Mui-disabled": {
                               backgroundColor: "rgb(29, 155, 240)", opacity: "0.5", color: "#fff",
                             },
                           }}
                           disabled={!content.length}
                           onClick={handleCreatePost}>Post</LoadingButton>
          </Stack>
        </Box>
      </Box>
      <Divider/>
    </Box>
  </>);
};

export default CreatePost;
