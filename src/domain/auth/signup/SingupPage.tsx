import { Flex } from "@chakra-ui/react";
import SignUpForm from "./Components/SignUpForm";
import StartAppBar from "../../../common/components/AppBar/StartAppBar";

const SignupPage = () => {
  return (
    <>
      <Flex minH="100vh" direction="column" bg={"#F7F9F4"}>
        <StartAppBar />
        <Flex
          mt={"50px"}
          minH={"calc(100vh - 110px)"}
          direction={"row"}
          align={"center"}
        >
          <SignUpForm />
        </Flex>
      </Flex>
    </>
  );
};

export default SignupPage;
