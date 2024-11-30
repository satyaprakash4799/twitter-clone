import React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import XIcon from "@mui/icons-material/X";
import Button from "@mui/material/Button";
import "./root.css";
import {Outlet, useNavigate} from "react-router-dom";

const Root = () => {
  const navigate = useNavigate();

  const onSignInClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/sign-in");
  };

  const onSignUpClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/sign-up");
  };
  return (
    <>
      <CssBaseline/>
      <Container
        sx={{
          padding: '0 !important',
          margin: '0 !important',
          backgroundColor: "rgb(0, 0, 0)",
          height: "100vh",
          minWidth: "100vw"
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: "center",
            height: '100%',
            width: '100%',
            justifyContent: "center"
          }}
        >
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <XIcon sx={{color: "#fff", height: "400px", width: "400px"}}/>
          </Box>
          <Box display={"flex"} flexDirection={"column"} sx={{color: "#fff"}}>
            <Box typography={"h2"}>Happening now</Box>
            <Box typography={"h4"}>Join today.</Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              sx={{width: "300px"}}
            >
              <Button
                variant="contained"
                sx={{
                  margin: 1,
                  color: "rgb(25, 118, 210)",
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                }}
                onClick={onSignInClickHandler}
              >
                Sign in
              </Button>
              <Button
                variant="contained"
                sx={{
                  margin: 1,
                  backgroundColor: "rgb(25, 118, 210)",
                  color: "#fff",
                  borderRadius: "20px",
                }}
                onClick={onSignUpClickHandler}
              >
                Create account
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      <Outlet/>
    </>
  );
};

export default Root;
