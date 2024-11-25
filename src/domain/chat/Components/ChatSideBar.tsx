import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { User } from "../Utils/ChatUtils";
import { getFriendList } from "../api/ChatAPI";
import { fetcheImage } from "../../../common/utils/fetchImage"; // 이미지 fetching 함수
import { default_img } from "../../../common/utils/img"; // 기본 이미지

interface ChatSideBarProps {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  enterRoom: (user: User, crId: number) => void; // 대화방 입장 함수
}

function ChatSideBar({
  selectedUser,
  setSelectedUser,
  enterRoom,
}: ChatSideBarProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: string }>(
    {}
  ); // 이미지 로드 상태

  // 친구 리스트와 프로필 이미지 로드
  useEffect(() => {
    const fetchFriendListAndImages = async () => {
      try {
        const friendList = await getFriendList();
        setUsers(friendList); // 유저 목록 업데이트

        // 각 사용자 프로필 이미지를 비동기로 로드
        const imagePromises = friendList.map(async (user: User) => {
          const image = user.user_profile
            ? await fetcheImage(user.user_profile)
            : default_img;
          return { user_id: user.user_id, image };
        });

        const images = await Promise.all(imagePromises);
        const imageMap = images.reduce((acc, cur) => {
          acc[cur.user_id] = cur.image || default_img;
          return acc;
        }, {} as { [key: string]: string });

        setLoadedImages(imageMap); // 이미지 상태 업데이트
      } catch (error) {
        console.error("Failed to fetch friend list or images", error);
        setUsers([]); // 친구 목록이 없을 경우 빈 배열로 처리
      }
    };

    fetchFriendListAndImages();
  }, []); // 최초 실행 시 한 번만 실행

  const handleUserSelect = (user: User) => {
    setSelectedUser(user); // 선택된 유저 업데이트
  };

  return (
    <Box
      width="280px"
      bg={"linkling.50"}
      p={4}
      h={"100%"}
      borderRight="1px solid"
      borderColor="gray.200"
      shadow="md"
    >
      <Button
        width="100%"
        colorScheme="linkling"
        variant="solid"
        mb={2}
        py={3}
        borderRadius="lg"
        _hover={{ bg: "linkling.300" }}
        onClick={() => {
          setSelectedUser(null);
          const newUrl = `${window.location.pathname}`;
          window.history.replaceState({}, "", newUrl); // URL 변경
        }}
      >
        {t(`friend.matching`)}
      </Button>
      <VStack align="stretch" spacing={3}>
        <Button
          colorScheme="customGreen"
          variant="outline"
          py={3}
          borderRadius="lg"
          _hover={{ bg: "customGreen.100" }}
        >
          {t(`friend.all`)}
        </Button>
        {users.length > 0 ? (
          users.map((user) => (
            <Button
              key={user.cr_id}
              width="100%"
              colorScheme="linkling"
              variant={
                selectedUser && selectedUser.cr_id === user.cr_id
                  ? "solid"
                  : "ghost"
              }
              h={"60px"}
              p={6}
              borderRadius="xl"
              justifyContent="flex-start"
              onClick={() => handleUserSelect(user)} // 유저 선택 및 방 입장
              _hover={{ bg: "gray.200" }}
            >
              <HStack w="full" justify="space-between">
                <HStack>
                  {/* 프로필 이미지 로드 */}
                  <Avatar
                    my={2}
                    size="md"
                    src={loadedImages[user.user_id] || default_img} // 로드된 이미지 또는 기본 이미지
                  />
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold">
                      {user.user_nickname}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {user.recent_msg}
                    </Text>
                  </VStack>
                </HStack>
                {user.unread_count > 0 && (
                  <Badge colorScheme="red" variant="solid" px={2} py={1}>
                    {user.unread_count}
                  </Badge>
                )}
              </HStack>
            </Button>
          ))
        ) : (
          <Text fontSize="md" color="gray.500" align="center">
            {t(`friend.noFriends`)}
          </Text>
        )}
      </VStack>
    </Box>
  );
}

export default ChatSideBar;
