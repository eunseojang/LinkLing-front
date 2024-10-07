import { Box, Input, Button, Text, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface FriendSearchProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

const FriendSearch: FC<FriendSearchProps> = ({
  searchTerm,
  handleSearchChange,
  handleSearch,
}) => {
  const { t } = useTranslation();

  return (
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
        <Button onClick={handleSearch} colorScheme="linkling" size="md">
          {t(`friend.search`)}
        </Button>
      </HStack>
    </Box>
  );
};

export default FriendSearch;
