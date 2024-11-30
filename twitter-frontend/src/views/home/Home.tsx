import {useEffect} from "react";
import {Box, Container, CssBaseline} from "@mui/material";

import SideView from "../../components/sideview/Sideview";
import Main from "../../components/main/Main";


const Home = () => {

  useEffect(() => {
    document.title = "Home";
  }, []);
  return (
    <>
      <CssBaseline/>
      <Container sx={{display: "flex"}}>
        <SideView/>
        <Box sx={{display: "flex", width: "inherit", flexDirection: "row"}}>
          <Main/>
        </Box>
      </Container>
    </>
  );
};

export default Home;
