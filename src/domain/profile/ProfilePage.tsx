import { Box } from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import UserProfileComponent from "./components/userProfile";

const ProfilePage = () => {
  return (
    <Box bg={"#F7F9F4"}>
      <AppBar />
      <Box mt={"60px"}>
        <UserProfileComponent />
        내가 작성한 게시물들 목록 보여줄 예정
      </Box>
    </Box>
  );
};

export default ProfilePage;
