import {
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Tag,
  TagLabel,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { FC } from "react";
import "flag-icons/css/flag-icons.min.css"; // CSS 파일을 import 합니다.

interface UserProfile {
  user_profile: string; // 프로필 이미지 URL
  user_id: string; // 사용자 ID
  user_name: string; // 사용자 이름
  user_gender: "male" | "female"; // 사용자 성별
  online: boolean; // 온라인 상태
  follower: number; // 팔로워 수
  user_nation: string; // 국가 코드
  user_info: string; // 추가 정보
  user_lang: string[]; // 가능한 언어
}

interface UserProfileProps {
  profile: UserProfile;
}

const UserProfileComponent: FC<UserProfileProps> = ({ profile }) => {
  const getFlagClass = (nation: string) => {
    switch (nation) {
      case "KR":
        return "fi fi-kr"; // 한국
      case "US":
        return "fi fi-us"; // 미국
      case "JP":
        return "fi fi-jp"; // 일본
      case "CN":
        return "fi fi-cn"; // 중국
      default:
        return "fi fi-unknown"; // 알 수 없는 국가
    }
  };
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      w={{ base: "90%", sm: "80%", md: "60%" }}
      margin="auto"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Image
        borderRadius="full"
        boxSize="150px"
        src={profile.user_profile}
        alt={profile.user_name}
        mx="auto"
        mb={4}
      />
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={2}>
        {profile.user_name}
      </Text>
      <Text fontSize="md" color="gray.600" textAlign="center" mb={4}>
        @{profile.user_id}
      </Text>
      <Stack spacing={3} mt={4} textAlign="center">
        <Text>
          <Badge
            fontSize={"md"}
            variant="solid"
            colorScheme={profile.online ? "green" : "red"}
          >
            {profile.online ? "Online" : "Offline"}
          </Badge>
        </Text>
        <Text fontSize="lg" fontWeight="semibold">
          Followers: {profile.follower}
        </Text>
        <Stack direction="row" align="center" justify="center" spacing={2}>
          <span
            className={getFlagClass(profile.user_nation)}
            style={{ fontSize: "24px" }}
          ></span>
        </Stack>
        <Text fontSize="md">Info: {profile.user_info}</Text>
        <VStack spacing={1} align="start" mt={4} textAlign="left" mx="auto">
          <Text fontSize="lg" fontWeight="bold">
            Languages:
          </Text>
          <Flex>
            {profile.user_lang.map((lang, index) => (
              <Tag key={index} bg="#73DA95" variant="solid" mr={2}>
                <TagLabel>{lang}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </VStack>
      </Stack>
    </Box>
  );
};

export default UserProfileComponent;
