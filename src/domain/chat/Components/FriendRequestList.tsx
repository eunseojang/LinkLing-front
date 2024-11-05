import { VStack, HStack, Avatar, Button, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Friend } from "../Utils/FriendUtils";
import { fetcheImage } from "../../../common/utils/fetchImage"; // 이미지 fetching 함수 import
import { default_img } from "../../../common/utils/img"; // 기본 이미지 import

interface FriendRequestListProps {
  friendRequests: any[];
  handleConfirmRequest: (id: string, confirm: boolean) => void;
}

const FriendRequestList: FC<FriendRequestListProps> = ({
  friendRequests,
  handleConfirmRequest,
}) => {
  const { t } = useTranslation();
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = friendRequests.map(async (request) => {
        const image = request.user_img
          ? await fetcheImage(request.user_img)
          : default_img;
        return { user_id: request.user_id, image };
      });

      const images = await Promise.all(imagePromises);
      const imageMap = images.reduce((acc, cur) => {
        const userId = cur.user_id; // userId를 추출
        if (userId) {
          acc[userId] = cur.image || default_img;
        }
        return acc;
      }, {} as { [key: string]: string });

      setLoadedImages((prev) => ({ ...prev, ...imageMap }));
    };

    loadImages();
  }, [friendRequests]);

  return (
    <VStack spacing={4} align="stretch">
      {friendRequests.map((request) => (
        <HStack
          key={request.user_id || "unknown"} // userId가 없으면 fallback 키 사용
          justify="space-between"
          p={2}
          _hover={{ bg: "gray.50" }}
          borderRadius="md"
        >
          <HStack>
            <Avatar
              size="md"
              src={loadedImages[request.user_id!] ?? default_img} // userId가 null이 아닌 경우만 사용
            />
            <HStack spacing={0} align="end">
              <Text fontWeight="bold" color="gray.800">
                {request.user_name}
              </Text>
              <Text color="gray" fontSize={"13px"} ml={0.5}>
                @{request.user_id}
              </Text>
            </HStack>
          </HStack>
          <HStack>
            <Button
              size="sm"
              mr={2}
              colorScheme="green"
              onClick={() => handleConfirmRequest(request.user_id!, true)} // userId가 null이 아니라고 가정
            >
              {t(`friend.approve`)}
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => handleConfirmRequest(request.user_id!, false)} // userId가 null이 아니라고 가정
            >
              {t(`friend.reject`)}
            </Button>
          </HStack>
        </HStack>
      ))}
    </VStack>
  );
};

export default FriendRequestList;
