import { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  Flex,
  Spinner,
  Button,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import "flag-icons/css/flag-icons.min.css";
import { getProfile } from "../api/ProfileAPI";
import { default_img } from "../../../common/utils/img";
import { getFlagClass, UserProfile } from "../utils/ProfileUtils";
import { useParams } from "react-router-dom";
import ProfileEditModal from "./ProfileEditModal";
import { requestFriend } from "../api/FreindAPI";
import { useToastMessage } from "../../../common/components/useToastMessage";
import { fetcheImage } from "../../../common/utils/fetchImage";

const UserProfileComponent: FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { nickName: id } = useParams<{ nickName: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useToastMessage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await getProfile(id!);
      setProfile({ ...response });
    } catch (err) {
      setError("존재하지 않는 사용자입니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchImage = async () => {
      if (profile?.user_profile) {
        const img = await fetcheImage(profile.user_profile);
        setImageSrc(img);
      } else {
        setImageSrc(null);
      }
    };

    fetchImage();
  }, [profile]);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="md" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  if (!profile) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text>No profile data available.</Text>
      </Flex>
    );
  }

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      w={"800px"}
      margin="auto"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="xs"
    >
      <Flex align="center" mb={6} w={"700px"} margin={"0 auto"}>
        <Image
          borderRadius="full"
          boxSize="120px"
          src={imageSrc || default_img}
          alt={profile?.user_name || "Profile Image"}
        />
        <Box ml={5} flex={1}>
          <Flex alignItems={"center"}>
            <Text fontSize="xl" fontWeight="bold">
              {profile.user_name}
            </Text>
            <Text
              fontSize="xs"
              color="gray.600"
              ml={2}
              border={"1px solid"}
              borderColor={"gray.200"}
              shadow={"md"}
            >
              {profile.user_nation && (
                <span
                  className={getFlagClass(profile.user_nation)}
                  style={{ fontSize: "20px" }}
                ></span>
              )}
            </Text>
          </Flex>
          <Text fontSize="md" color="gray.600" mt={-1}>
            @{profile.user_id}
          </Text>
          <Badge
            variant="subtle"
            fontSize="sm"
            colorScheme={profile.online ? "green" : "gray"}
          >
            {profile.online ? "온라인" : "오프라인"}
          </Badge>
        </Box>
        <HStack spacing={4} justify="center">
          {profile.profile_info === "HOST" && (
            <Button colorScheme="pink" onClick={onOpen}>
              프로필 수정하기
            </Button>
          )}
          {profile.profile_info === "FRIEND" && (
            <Button colorScheme="gray" onClick={() => alert("Message sent!")}>
              메세지 보내기
            </Button>
          )}
          {profile.profile_info === "PENDING" && (
            <Button colorScheme="gray" onClick={() => alert("Pending...")}>
              대기중
            </Button>
          )}
          {profile.profile_info === "ACCEPT" && (
            <Button colorScheme="green" onClick={() => alert("Accept friend!")}>
              수락하기
            </Button>
          )}
          {profile.profile_info === "NOTFRIEND" && (
            <Button
              colorScheme="linkling"
              onClick={async () => {
                try {
                  await requestFriend(profile.user_id);
                  window.location.reload();
                  showToast("친구 요청 성공", "ㄴㅇ", "success");
                } catch (error) {
                  showToast("친구 요청 실패", "ㄴㅇ", "error");
                }
              }}
            >
              친구 추가
            </Button>
          )}
        </HStack>
      </Flex>
      {profile.user_info && (
        <Box
          bg="#D8FAE6"
          p={3}
          borderRadius="md"
          w={"600px"}
          mt={"13px"}
          ml={"130px"}
        >
          <Text>{profile.user_info}</Text>
        </Box>
      )}
      <Flex justify="center" mt={6}>
        <Text mr={4}>
          친구: <strong>{profile.follower}</strong>
        </Text>
        <Text>
          게시물: <strong>{profile.post_count}</strong>
        </Text>
      </Flex>
      <ProfileEditModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          fetchProfile();
        }}
        editedProfile={profile}
        handleCancelClick={async () => {
          onClose();
        }}
      />
    </Box>
  );
};

export default UserProfileComponent;
