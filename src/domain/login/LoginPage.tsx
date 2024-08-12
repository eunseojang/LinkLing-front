import StartAppBar from "../../common/components/AppBar/StartAppBar";
import LoginForm from "./components/LoginForm";
import { VStack, Box } from "@chakra-ui/react";

const LoginPage = () => {
  return (
    <>
      <Box h={"100vh"} bg={"#F7F9F4"}>
        <StartAppBar />
        <VStack paddingTop={"30px"} justify="center">
          <LoginForm />
        </VStack>
      </Box>
    </>
  );
};

export default LoginPage;
