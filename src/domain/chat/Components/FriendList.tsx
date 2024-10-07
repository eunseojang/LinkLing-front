import { VStack, HStack, Avatar, Badge, Button, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Friend } from "../Utils/FriendUtils";
import { fetcheImage } from "../../../common/utils/fetchImage"; // 이미지 fetching 함수 import
import { default_img } from "../../../common/utils/img"; // 기본 이미지 import

interface FriendListProps {
  friends: Friend[];
  deleteFriend: (id: string) => void;
  navigate: (userId: string) => void;
}

const FriendList: FC<FriendListProps> = ({
  friends,
  deleteFriend,
  navigate,
}) => {
  const { t } = useTranslation();
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = friends.map(async (friend) => {
        // 이미지가 null이거나 비어있으면 기본 이미지를 사용
        const image = friend.userImg
          ? await fetcheImage(friend.userImg)
          : default_img;
        return { userId: friend.userId, image };
      });

      const images = await Promise.all(imagePromises);
      const imageMap = images.reduce((acc, cur) => {
        const userId = cur.userId; // userId를 추출
        if (userId) {
          // userId가 null이 아닐 때만 추가
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
          key={friend.userId || "unknown"} // userId가 없으면 fallback 키 사용
          justify="space-between"
          p={2}
          _hover={{ bg: "gray.50" }}
          borderRadius="md"
          onClick={() => {
            navigate(friend.userId);
          }}
        >
          <HStack>
            <Avatar
              size="md"
              src={loadedImages[friend.userId] ?? default_img} // 이미지가 없을 경우 기본 이미지 사용
            />
            <VStack spacing={0} align="start">
              <Text fontWeight="bold" color="gray.800">
                {friend.userName}
              </Text>
              <Badge
                colorScheme={friend.online ? "green" : "gray"}
                variant="subtle"
                fontSize="sm"
              >
                {friend.online ? t(`friend.online`) : t(`friend.offline`)}
              </Badge>
            </VStack>
          </HStack>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation(); // 버튼 클릭 시 HStack의 onClick이 호출되지 않도록 방지
              deleteFriend(friend.userId);
            }}
          >
            {t(`friend.delete`)}
          </Button>
        </HStack>
      ))}
    </VStack>
  );
};

export default FriendList;
