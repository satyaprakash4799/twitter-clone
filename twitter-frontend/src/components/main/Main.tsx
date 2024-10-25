import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import CreatePost from "../create-post/CreatePost";

interface MainProps {
}
const Main = (props: MainProps) => {
  const [activeTabValue, setActiveTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabValue(newValue);
  };

  return (
    <>
      <Box sx={{ flex: "0 0 100%" }}>
        <Tabs
          value={activeTabValue}
          onChange={handleTabChange}
          aria-label="tabs"
          variant="fullWidth"
        >
          <Tab label="For you" sx={{ textTransform: "none" }} />
          <Tab label="Following" sx={{ textTransform: "none" }} />
        </Tabs>
        <Box>
          <CreatePost />
          <CustomTabPanel index={0} value={activeTabValue}></CustomTabPanel>
          <CustomTabPanel index={1} value={activeTabValue}></CustomTabPanel>
        </Box>
      </Box>
    </>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default Main;
