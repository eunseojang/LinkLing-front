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
  const handleRemoveFriend = (user: User) => {
    console.log(`Removing ${user.name} from friends list.`);
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
        <Avatar size="md" name={selectedUser.name} src={selectedUser.avatar} />
        <Flex flexDirection={"column"}>
          <Text fontSize="xl" fontWeight="bold">
            {selectedUser.name}
          </Text>
          <Text fontSize="xs" color={"gray.100"} mt={-1}>
            {"@selectedUserid"}
          </Text>
        </Flex>
      </HStack>

      <Flex>
        <HStack>
          <Text fontSize="md" fontWeight="semibold">
            번역 모드
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
              친구 삭제
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default ChatAppBar;
