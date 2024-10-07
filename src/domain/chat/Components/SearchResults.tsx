import { Box, HStack, Avatar, VStack, Button, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Friend } from "../Utils/FriendUtils";

interface SearchResultsProps {
  searchResults: Friend[];
  handleRequestFriend: (id: string) => void;
}

const SearchResults: FC<SearchResultsProps> = ({
  searchResults,
  handleRequestFriend,
}) => {
  const { t } = useTranslation();

  return (
    searchResults.length > 0 && (
      <Box
        w="600px"
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        boxShadow="md"
      >
        <Text mb={4} fontWeight="bold" fontSize="lg" color="gray.700">
          {t(`friend.searchResults`)}
        </Text>
        <VStack spacing={4} align="stretch">
          {searchResults.map((result) => (
            <HStack key={result.userId} justify="space-between" p={2}>
              <HStack>
                <Avatar size="md" src={result.userImg || ""} />
                <VStack spacing={0} align="start">
                  <Text fontWeight="bold" color="gray.800">
                    {result.userName}
                  </Text>
                </VStack>
              </HStack>
              <Button
                size="sm"
                colorScheme="linkling"
                onClick={() => handleRequestFriend(result.userId)}
              >
                {t(`friend.request`)}
              </Button>
            </HStack>
          ))}
        </VStack>
      </Box>
    )
  );
};

export default SearchResults;
