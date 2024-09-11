import { Flex } from "@chakra-ui/react";
import OauthSignUpForm from "./Components/SignUpForm";
import StartAppBar from "../../../common/components/AppBar/StartAppBar";

const OauthSignupPage = () => {
  return (
    <>
      <Flex minH="100vh" direction="column" bg={"#F7F9F4"}>
        <StartAppBar />
        <Flex
          mt={"30px"}
          minH={"calc(100vh - 30px)"}
          direction={"row"}
          align={"center"}
        >
          <OauthSignUpForm />
        </Flex>
      </Flex>
    </>
  );
};

export default OauthSignupPage;
