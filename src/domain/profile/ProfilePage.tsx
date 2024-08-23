import { Box } from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import UserProfileComponent from "./components.tsx/userProfile";

interface UserProfile {
  user_profile: string;
  user_id: string;
  user_name: string;
  user_gender: "male" | "female";
  online: boolean;
  follower: number;
  user_nation: string;
  user_info: string;
  user_lang: string[];
}

const exampleUserProfile: UserProfile = {
  user_profile:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoE_8rTWHnRPEZYgsmH-8r-I5aTjlPXotO6Q&s",
  user_id: "ididid",
  user_name: "사용자 이름",
  user_gender: "male",
  online: true,
  follower: 120,
  user_nation: "KR",
  user_info: "English or Spanish 공부를 하고 싶어요",
  user_lang: ["Korean", "Japanese", "English"],
};

const ProfilePage = () => {
  return (
    <Box bg={"#F7F9F4"}>
      <AppBar />
      <Box mt={"60px"}>
        <UserProfileComponent profile={exampleUserProfile} />
        내가 작성한 게시물들 목록 보여줄 예정
      </Box>
    </Box>
  );
};

export default ProfilePage;
