import {
  Box,
  Input,
  Button,
  Text,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  VStack,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetcheImage } from "../../../common/utils/fetchImage";
import { default_img } from "../../../common/utils/img";
import { useNavigate } from "react-router-dom";

interface FriendSearchProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  searchResults: any[];
  handleRequestFriend: (id: string) => void;
}

const FriendSearch: FC<FriendSearchProps> = ({
  searchTerm,
  handleSearchChange,
  handleSearch,
  searchResults,
  handleRequestFriend,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = searchResults.map(async (result) => {
        const image = result.user_img
          ? await fetcheImage(result.user_img)
          : default_img;
        return { user_id: result.user_id, image };
      });

      const images = await Promise.all(imagePromises);
      const imageMap = images.reduce((acc, cur) => {
        if (cur.user_id) {
          acc[cur.user_id] = cur.image || default_img;
        }
        return acc;
      }, {} as { [key: string]: string });

      setLoadedImages((prev) => ({ ...prev, ...imageMap }));
    };

    loadImages();
  }, [searchResults]);

  const onSearch = () => {
    handleSearch();
    setIsPopoverOpen(true);
  };

  return (
    <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
      <PopoverTrigger>
        <Box
          w="600px"
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="md"
        >
          <Text mb={4} fontWeight="bold" fontSize="lg" color="gray.700">
            {t(`friend.humanSearch`)}
          </Text>
          <HStack>
            <Input
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t(`friend.idNicknameSearch`)}
              variant="outline"
              focusBorderColor="green.400"
              size="md"
            />
            <Button onClick={onSearch} colorScheme="linkling" size="md">
              {t(`friend.search`)}
            </Button>
          </HStack>
        </Box>
      </PopoverTrigger>
      <PopoverContent width="600px" maxHeight="400px" overflowY="auto">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <VStack spacing={4} align="stretch">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <HStack
                  key={result.user_id || "unknown"}
                  justify="space-between"
                  p={2}
                  _hover={{ bg: "gray.50" }}
                >
                  <HStack onClick={() => navigate(`/${result.user_id}`)}>
                    <Avatar
                      size="md"
                      src={loadedImages[result.user_id] ?? default_img}
                    />
                    <VStack spacing={0} align="start">
                      <Flex>
                        <Text fontWeight="bold" color="gray.800">
                          {result.user_name}
                        </Text>
                        <Text
                          fontSize={"10px"}
                          fontWeight="bold"
                          ml={1}
                          mt={1}
                          color="gray.500"
                        >
                          @{result.user_id}
                        </Text>
                      </Flex>
                    </VStack>
                  </HStack>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={(e) => {
                      e.stopPropagation(); // navigate와 분리되도록 이벤트 전파 중지
                      handleRequestFriend(result.user_id);
                    }}
                  >
                    {t(`friend.request`)}
                  </Button>
                </HStack>
              ))
            ) : (
              <Text color="gray.500">{t(`friend.noResults`)}</Text>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FriendSearch;
