import StartAppBar from "../../common/components/AppBar/StartAppBar";
import { VStack } from "@chakra-ui/react";
import SignUpForm from "./Components/SignUpForm";

const SignupPage = () => {
  return (
    <>
      <StartAppBar />
      <VStack
        justify="center"
        bg={"#F7F9F4"}
      >
        <SignUpForm />
      </VStack>
    </>
  );
};

export default SignupPage;
