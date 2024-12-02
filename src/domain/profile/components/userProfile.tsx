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
import { useNavigate, useParams } from "react-router-dom";
import ProfileEditModal from "./ProfileEditModal";
import { confirmFriend, requestFriend } from "../api/FreindAPI";
import { useToastMessage } from "../../../common/components/useToastMessage";
import { fetcheImage } from "../../../common/utils/fetchImage";
import { useTranslation } from "react-i18next"; // useTranslation import 추가
import { getChatRoomID } from "../../chat/api/ChatAPI";

const UserProfileComponent: FC = () => {
  const { t } = useTranslation(); // useTranslation 훅 사용
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { nickName: id } = useParams<{ nickName: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useToastMessage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await getProfile(id!);
      setProfile({ ...response });
    } catch (err) {
      setError(t("profile.user_not_found")); // 번역 파일 사용
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
        <Text>{t("profile.no_profile_data")}</Text> {/* 번역 파일 사용 */}
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
              {t("profile.edit_profile")} {/* 번역 파일 사용 */}
            </Button>
          )}
          {profile.profile_info === "FRIEND" && (
            <Button
              colorScheme="gray"
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const id = await getChatRoomID(profile.user_id);
                  navigate("/linkchat?roomId=" + id);
                  console.log("채팅창으로 이동하게 setting 필요", id);
                } catch (error) {
                  console.error("Failed to get chat room ID", error);
                }
              }}
            >
              {t("profile.send_message")} {/* 번역 파일 사용 */}
            </Button>
          )}
          {profile.profile_info === "PENDING" && (
            <Button colorScheme="gray" onClick={() => alert("Pending...")}>
              {t("profile.pending")} {/* 번역 파일 사용 */}
            </Button>
          )}
          {profile.profile_info === "ACCEPT" && (
            <Button
              colorScheme="green"
              onClick={async () => {
                await confirmFriend(profile.user_id, true);
                window.location.reload();
              }}
            >
              {t("profile.accept_friend")} {/* 번역 파일 사용 */}
            </Button>
          )}
          {profile.profile_info === "NOTFRIEND" && (
            <Button
              colorScheme="linkling"
              onClick={async () => {
                try {
                  await requestFriend(profile.user_id);
                  window.location.reload();
                  showToast(
                    t("profile.friend_request_success"),
                    "",
                    "success"
                  ); // 번역 파일 사용
                } catch (error) {
                  showToast(
                    t("profile.friend_request_failure"),
                    "",
                    "error"
                  ); // 번역 파일 사용
                }
              }}
            >
              {t("profile.add_friend")} {/* 번역 파일 사용 */}
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
          {t("profile.friends")}: <strong>{profile.follower}</strong>{" "}
          {/* 번역 파일 사용 */}
        </Text>
        <Text>
          {t("profile.posts")}: <strong>{profile.post_count}</strong>{" "}
          {/* 번역 파일 사용 */}
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
