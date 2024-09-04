import { Box, Flex } from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import SettingForm from "./components/SettingForm";

const SettingPage = () => {
  return (
    <Box bg={"#F7F9F4"}>
      <AppBar />
      <Flex mt={"60px"} h={"calc(100vh - 60px)"} alignItems={"center"}>
        <SettingForm />
      </Flex>
    </Box>
  );
};

export default SettingPage;
