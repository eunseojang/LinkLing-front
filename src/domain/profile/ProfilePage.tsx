import { Box} from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import UserProfileComponent from "./components/userProfile";
import Feed from "./components/Feed";

const ProfilePage = () => {
  return (
    <Box bg={"#F7F9F4"} minH={"100vh"}>
      <AppBar />
      <Box h={"20px"}></Box>
      <Box mt={"60px"}>
        <UserProfileComponent />
      </Box>
      <Feed />
     
    </Box>
  );
};

export default ProfilePage;
