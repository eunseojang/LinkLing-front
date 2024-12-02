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
import { fetcheImage } from "../../../common/utils/fetchImage";
import { default_img } from "../../../common/utils/img";

interface ChatSideBarProps {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  setCrId: (id: number) => void;
}

function ChatSideBar({
  selectedUser,
  setSelectedUser,
  setCrId,
}: ChatSideBarProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchFriendListAndImages = async () => {
      try {
        const friendList = await getFriendList();
        setUsers(friendList);

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

        setLoadedImages(imageMap);
      } catch (error) {
        console.error("Failed to fetch friend list or images", error);
        setUsers([]);
      }
    };

    fetchFriendListAndImages();

    const intervalId = setInterval(fetchFriendListAndImages, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleUserSelect = (user: User) => {
    if (user.cr_id) {
      setSelectedUser(user);
      setCrId(user.cr_id);
    }
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
          window.history.replaceState({}, "", newUrl);
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
              onClick={() => handleUserSelect(user)}
              _hover={{ bg: "gray.200" }}
            >
              <HStack w="full" justify="space-between">
                <HStack>
                  <Avatar
                    my={2}
                    size="md"
                    src={loadedImages[user.user_id] || default_img}
                  />
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold">
                      {user.user_nickname}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      maxW={"150px"}
                      isTruncated
                    >
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
