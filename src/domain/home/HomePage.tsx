import AppBar from "../../common/components/AppBar/AppBar";
import { Box } from "@chakra-ui/react";
import HomeForm from "./HomeForm";

const HomePage = () => {
  return (
    <Box bg={"#F7F9F4"}>
      <AppBar />
      <Box mt={"60px"}>
        <HomeForm />
      </Box>
    </Box>
  );
};

export default HomePage;
