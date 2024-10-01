import { Box } from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import FriendComponent from "../chat/Components/FriendComponent";
import MatchingComponent from "./components/MatchingComponent";

const LingPage = () => {
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

export default LingPage;
