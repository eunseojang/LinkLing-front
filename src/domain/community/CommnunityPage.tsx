import { Box } from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import FriendComponent from "./components.tsx/FriendComponent";
import MatchingComponent from "./components.tsx/MatchingComponent";

const CommunityPage = () => {
  return (
    <Box bg={"#F7F9F4"}>
      <AppBar />
      <Box mt={"60px"}>
        <FriendComponent />
        <MatchingComponent />
      </Box>
    </Box>
  );
};

export default CommunityPage;
