import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import XIcon from "@mui/icons-material/X";
import CloseIcon from "@mui/icons-material/Close";
import { Button, TextField } from "@mui/material";

import apiClient from "../../../hooks/apiCaller";

const SignIn = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => {
    setModalOpen(false);
    navigate("/");
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    elementFor: string
  ) => {
    if (elementFor === "username") {
      setUserName(event.target.value);
    }
    if (elementFor === "password") {
      setPassword(event.target.value);
    }
  };

  const validateLogin = async () => {
    try {
      const { data } = await apiClient.post("/user/signin", {
        username,
        password,
      });
      setUserName('');
      setPassword('');
      localStorage.setItem('token', data?.token);
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Dialog
        open={modalOpen}
        slotProps={{
          backdrop: {
            style: { backgroundColor: "rgba(91, 112, 131, 0.4)" },
          },
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <CloseIcon
              sx={{ color: "#fff", position: "absolute", left: "20px" }}
              fontSize="small"
              onClick={handleClose}
            />
            <XIcon sx={{ color: "#fff" }} fontSize="medium" />
          </Box>

          <Box typography={"h4"} sx={{ paddingTop: 2, paddingBottom: 2 }}>
            Sign in to X
          </Box>
          <Box
            component="form"
            sx={{
              m: 1,
              width: "300px",
            }}
          >
            <TextField
              label="Phone, email or username"
              sx={{
                m: 1,
                "& .MuiInputBase-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "gray",
                  },
                },
                "& .MuiFormLabel-root": {
                  color: "gray",
                  "&.Mui-focused": {
                    color: "#1976d2",
                  },
                },
                width: "inherit",
              }}
              onChange={(event) => handleChange(event, "username")}
            ></TextField>
            <TextField
              label="Password"
              type="password"
              sx={{
                m: 1,
                "& .MuiInputBase-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "gray",
                  },
                },
                "& .MuiFormLabel-root": {
                  color: "gray",
                  "&.Mui-focused": {
                    color: "#1976d2",
                  },
                },
                width: "inherit",
              }}
              onChange={(event) => handleChange(event, "password")}
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
              disabled={!username?.length || !password?.length}
              onClick={validateLogin}
            >
              Sign in
            </Button>
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
                  color: "rgb(239, 243, 244)",
                  backgroundColor: "rgb(15, 20, 25)",
                  opacity: 0.5,
                },
              }}
              disabled={true}
            >
              Forgot password
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default SignIn;
