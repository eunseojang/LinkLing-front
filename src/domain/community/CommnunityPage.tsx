import { Box } from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import Feed from "./components/Feed";

const CommunityPage = () => {
  return (
    <Box bg={"#F7F9F4"} minHeight="100vh">
      <AppBar />
      <Box mt={"60px"} minH={"calc(100vh - 60px)"}>
        <Feed />
      </Box>
    </Box>
  );
};

export default CommunityPage;
