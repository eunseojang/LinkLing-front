import StartAppBar from "../../common/components/AppBar/StartAppBar";
import LoginForm from "./components/LoginForm";
import { VStack } from "@chakra-ui/react";

const LoginPage = () => {
  return (
    <>
      <StartAppBar />
      <VStack
        mt={"50px"}
        minH={"calc(100vh - 60px)"}
        spacing={8}
        w="full"
        justify="center"
        align={"center"}
        bg={"#F7F9F4"}
      >
        <LoginForm />
      </VStack>
    </>
  );
};

export default LoginPage;
