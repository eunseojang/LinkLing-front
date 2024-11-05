import { Box } from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import LevelTest from "./LevelTest";

const LevelTestPage = () => {
  return (
    <Box bg={"#F7F9F4"} minH={"100vh"}>
      <AppBar />
      <Box h={"20px"}></Box>
      <Box mt={"60px"}>
        <LevelTest />
      </Box>
    </Box>
  );
};

export default LevelTestPage;
