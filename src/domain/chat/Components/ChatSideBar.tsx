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

interface ChatSideBarProps {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  enterRoom: (user: User, crId: number) => void; // 대화방 입장 함수 추가
}

function ChatSideBar({
  selectedUser,
  setSelectedUser,
  enterRoom,
}: ChatSideBarProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const friendList = await getFriendList();
        setUsers(friendList);
      } catch (error) {
        console.error("Failed to fetch friend list", error);
      }
    };

    fetchFriendList();
  }, []);

  const handleUserSelect = (user: User) => {
    console.log("선택한 유저", user);
    setSelectedUser(user); // 선택된 유저 업데이트
    if (user.cr_id) {
      enterRoom(user, user.cr_id); // 방 입장
    }
  };

  return (
    <Box
      width="280px"
      bg={"gray.100"}
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
        onClick={() => setSelectedUser(null)}
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
              colorScheme="gray"
              variant={
                selectedUser && selectedUser.cr_id === user.cr_id
                  ? "solid"
                  : "ghost"
              }
              p={6}
              borderRadius="xl"
              justifyContent="flex-start"
              onClick={() => handleUserSelect(user)} // 유저 선택 및 방 입장
              _hover={{ bg: "gray.200" }}
            >
              <HStack w="full" justify="space-between">
                <HStack>
                  <Avatar
                    size="md"
                    name={user.user_nickname}
                    src={user.user_profile}
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
