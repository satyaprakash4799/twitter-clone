import { useEffect, useState } from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import apiClient from "../../hooks/apiCaller";
import SideView from "../../components/sideview/Sideview";
import Main from "../../components/main/Main";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await apiClient.get("/user");
      setUser(data?.user);
    };
    try {
      getUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ display: "flex" }}>
        <SideView user={user} />
        <Box sx={{ display: "flex", width: "inherit", flexDirection: "row" }}>
          <Main user={user} />
        </Box>
      </Container>
    </>
  );
};

export default Home;
