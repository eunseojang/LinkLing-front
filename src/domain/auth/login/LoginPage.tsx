import StartAppBar from "../../../common/components/AppBar/StartAppBar";
import LoginForm from "./components/LoginForm";
import { Flex } from "@chakra-ui/react";

const LoginPage = () => {
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
          <LoginForm />
        </Flex>
      </Flex>
    </>
  );
};

export default LoginPage;
