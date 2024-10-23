import { useEffect, useState } from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import SideView from "../../components/sideview/Sideview";
import Main from "../../components/main/Main";

const Home = () => {


  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ display: "flex" }}>
        <SideView />
        <Box sx={{ display: "flex", width: "inherit", flexDirection: "row" }}>
          <Main />
        </Box>
      </Container>
    </>
  );
};

export default Home;
