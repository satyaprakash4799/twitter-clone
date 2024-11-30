import React, {useEffect, useState} from "react";
import {Box, Button, Dialog, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import XIcon from "@mui/icons-material/X";
import {useNavigate} from "react-router-dom";
import apiClient from "../../../hooks/apiCaller";
import {useSnackbar} from "../../../components/common/SnackbarStack";


const commonTextFieldStyle = {
  m: 1,
  "& .MuiInputBase-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "gray",
    },
    "&:not(.Mui-focused):hover fieldset": {
      borderColor: "gray",
    },
    '&.Mui-focused fieldset': {
      borderColor: "#1976d2",
    }

  },
  "& .MuiFormLabel-root": {
    color: "gray",
    "&.Mui-focused": {
      color: "#1976d2",
    },
  },
  width: "inherit",
};

const SignUp = () => {
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');


  const navigate = useNavigate();
  const {addSnackbar} = useSnackbar();

  useEffect(() => {
    setModelOpen(true);
  }, []);

  const handleClose = () => {
    setModelOpen(false);
    navigate('/');
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    elementFor: string
  ) => {
    if (elementFor === "username") {
      setUsername(event.target.value);
    } else if (elementFor === "password") {
      setPassword(event.target.value);
    } else if (elementFor === "firstName") {
      setFirstName(event.target.value);
    } else if (elementFor === "lastName") {
      setLastName(event.target.value);
    } else if (elementFor === "email") {
      setEmail(event.target.value);
    } else if (elementFor === "phoneNumber") {
      setPhoneNumber(event.target.value);
    }
  };

  const validateSignup = async () => {
    try {
      await apiClient.post("/user/signup", {
        username,
        password,
        email,
        phoneNumber,
        firstName,
        lastName,

      });
      setUsername('');
      setPassword('');
      setEmail('');
      setPhoneNumber('');
      setFirstName('');
      setLastName('');

      addSnackbar("User account created successfully!", "success");
      addSnackbar("Navigating to login page. Please login to use portal.", "info");
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Dialog
        open={modelOpen}
        slotProps={{
          backdrop: {
            style: {backgroundColor: "rgba(91, 112, 131, 0.4)"},
          }
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#000",
            borderRadius: "15px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
            width: "600px",
            height: "100%",
            padding: 1,
            color: "#fff",
          }}
        >
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <CloseIcon
              sx={{color: "#fff", position: "absolute", left: "20px"}}
              fontSize="small"
              onClick={handleClose}
            />
            <XIcon sx={{color: "#fff"}} fontSize="medium"/>
          </Box>
          <Box typography={"h4"} sx={{paddingTop: 2, paddingBottom: 2}}>
            Create your account
          </Box>
          <Box
            component={'form'}
            sx={{m: 1, width: "300px",}}
          >
            <TextField
              label="First Name"
              sx={commonTextFieldStyle}
              value={firstName}
              onChange={(event) => handleChange(event, "firstName")}
            ></TextField>
            <TextField
              label="Last Name"
              sx={commonTextFieldStyle}
              value={lastName}
              onChange={(event) => handleChange(event, "lastName")}
            ></TextField>
            <TextField
              label="Username"
              sx={commonTextFieldStyle}
              value={username}
              onChange={(event) => handleChange(event, "username")}
            ></TextField>
            <TextField
              label="Password"
              type={'password'}
              sx={commonTextFieldStyle}
              value={password}
              onChange={(event) => handleChange(event, "password")}
            ></TextField>
            <TextField
              label="Phone number"
              sx={commonTextFieldStyle}
              value={phoneNumber}
              onChange={(event) => handleChange(event, "phoneNumber")}
            ></TextField>
            <TextField
              label="Email"
              type={'email'}
              sx={commonTextFieldStyle}
              value={email}
              onChange={(event) => handleChange(event, "email")}
            ></TextField>
            <Button
              variant="contained"
              sx={{
                m: 1,
                width: "inherit",
                margin: 1,
                color: "#000",
                backgroundColor: "#fff",
                borderRadius: "20px",
                "&.Mui-disabled": {
                  backgroundColor: "rgb(239, 243, 244)",
                  color: "rgb(15, 20, 25)",
                  opacity: 0.5,
                },
              }}
              disabled={!username?.length || !password?.length || !firstName.length || !lastName.length || !email.length || !phoneNumber.length}
              onClick={validateSignup}
            >
              Create an account
            </Button>


          </Box>

        </Box>
      </Dialog>
    </>
  );
}

export default SignUp;