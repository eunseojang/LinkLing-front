import { Flex } from "@chakra-ui/react";
import FindPasswordForm from "./components/FindPasswordForm";
import StartAppBar from "../../../common/components/AppBar/StartAppBar";

const FindPasswordPage = () => {
  return (
    <>
      <Flex minH="100vh" direction="column" bg={"#F7F9F4"}>
        <StartAppBar />
        <Flex
          mt={"30px"}
          minH={"calc(100vh - 90px)"}
          direction={"row"}
          align={"center"}
        >
          <FindPasswordForm />
        </Flex>
      </Flex>
    </>
  );
};

export default FindPasswordPage;
