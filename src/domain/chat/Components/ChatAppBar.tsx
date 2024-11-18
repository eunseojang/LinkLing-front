import {
  Avatar,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
} from "@chakra-ui/react";
import { User } from "../Utils/ChatUtils";
import { FiMoreVertical } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface ChatAppBarProps {
  selectedUser: User;
  translateMode: boolean;
  setTranslateMode: (mode: boolean) => void;
}

function ChatAppBar({
  selectedUser,
  translateMode,
  setTranslateMode,
}: ChatAppBarProps) {
  const { t } = useTranslation();

  const handleRemoveFriend = (user: User) => {
    console.log(`Removing ${user.user_nickname} from friends list.`);
  };

  return (
    <Flex
      p={4}
      h={"60px"}
      bg="#73DA95"
      align="center"
      justify="space-between"
      borderBottom="1px solid"
      borderColor="gray.300"
      shadow="md"
    >
      <HStack>
        <Avatar
          size="md"
          name={selectedUser.user_nickname}
          src={selectedUser.user_profile}
        />
        <Flex flexDirection={"column"}>
          <Text fontSize="xl" fontWeight="bold">
            {selectedUser.user_nickname}
          </Text>
          <Text fontSize="xs" color={"gray.100"} mt={-1}>
            {"@" + selectedUser.user_id}
          </Text>
        </Flex>
      </HStack>

      <Flex>
        <HStack>
          <Text fontSize="md" fontWeight="semibold">
            {t(`translate.mode`)}
          </Text>
          <Switch
            isChecked={translateMode}
            onChange={() => setTranslateMode(!translateMode)}
            colorScheme="green"
            size="lg"
          />
        </HStack>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            colorScheme="linkling"
            color={"black"}
            icon={<FiMoreVertical />}
          />
          <MenuList>
            <MenuItem onClick={() => handleRemoveFriend(selectedUser)}>
              {t(`friend.deleteFriend`)}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default ChatAppBar;
