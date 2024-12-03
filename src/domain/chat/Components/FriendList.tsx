import {
  VStack,
  HStack,
  Avatar,
  Badge,
  Button,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetcheImage } from "../../../common/utils/fetchImage";
import { default_img } from "../../../common/utils/img";
import { getChatRoomID } from "../api/ChatAPI";

interface FriendListProps {
  friends: any[];
  deleteFriend: (id: string) => void;
  navigate: (userId: string) => void;
  handleChatGo: (id: number) => void;
}

const FriendList: FC<FriendListProps> = ({
  friends,
  deleteFriend,
  navigate,
  handleChatGo,
}) => {
  const { t } = useTranslation();
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = friends.map(async (friend) => {
        const image = friend.user_img
          ? await fetcheImage(friend.user_img)
          : default_img;
        return { user_id: friend.user_id, image };
      });

      const images = await Promise.all(imagePromises);
      const imageMap = images.reduce((acc, cur) => {
        const userId = cur.user_id;
        if (userId) {
          acc[userId] = cur.image || default_img;
        }
        return acc;
      }, {} as { [key: string]: string });

      setLoadedImages((prev) => ({ ...prev, ...imageMap }));
    };

    loadImages();
  }, [friends]);

  return (
    <VStack spacing={4} align="stretch">
      {friends.map((friend) => (
        <HStack
          key={friend.user_id || "unknown"}
          justify="space-between"
          p={2}
          _hover={{ bg: "gray.50" }}
          borderRadius="md"
          onClick={() => {
            navigate(`/${friend.user_id}`);
          }}
        >
          <HStack>
            <Avatar
              size="md"
              src={loadedImages[friend.user_id] ?? default_img}
            />
            <VStack spacing={0} align="start">
              <Flex>
                <Text fontWeight="bold" color="gray.800">
                  {friend.user_name}
                </Text>
                <Text
                  fontSize={"10px"}
                  fontWeight="bold"
                  ml={1}
                  mt={1}
                  color="gray.500"
                >
                  @{friend.user_id}
                </Text>
              </Flex>
              <Badge
                colorScheme={friend.online ? "green" : "gray"}
                variant="subtle"
                fontSize="sm"
              >
                {friend.online ? t(`friend.online`) : t(`friend.offline`)}
              </Badge>
            </VStack>
          </HStack>
          <Box>
            <Button
              mr={2}
              size="sm"
              colorScheme="green"
              variant="outline"
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const id = await getChatRoomID(friend.user_id);
                  handleChatGo(id);
                } catch (error) {
                  console.error("Failed to get chat room ID", error);
                }
              }}
            >
              {t(`friend.send`)}
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                deleteFriend(friend.user_id);
              }}
            >
              {t(`friend.delete`)}
            </Button>
          </Box>
        </HStack>
      ))}
    </VStack>
  );
};

export default FriendList;
