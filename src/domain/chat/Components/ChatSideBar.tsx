import {
  Avatar,
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { User } from "../Utils/ChatUtils";

interface ChatSideBarProps {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

function ChatSideBar({ selectedUser, setSelectedUser }: ChatSideBarProps) {
  const users: User[] = [
    { id: "id1", name: "Amma", avatar: "", unreadMessages: 2 },
    { id: "id2", name: "henry Kim", avatar: "", unreadMessages: 0 },
  ];

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
        랜덤 매칭
      </Button>
      <VStack align="stretch" spacing={3}>
        <Button
          colorScheme="customGreen"
          variant="outline"
          py={3}
          borderRadius="lg"
          _hover={{ bg: "customGreen.100" }}
        >
          모든 친구
        </Button>
        {users.map((user) => (
          <Button
            key={user.id}
            width="100%"
            colorScheme="gray"
            variant={
              selectedUser && selectedUser.id === user.id ? "solid" : "ghost"
            }
            p={6}
            borderRadius="xl"
            justifyContent="flex-start"
            onClick={() => setSelectedUser(user)}
            _hover={{ bg: "gray.200" }}
          >
            <HStack w="full" justify="space-between">
              <HStack>
                <Avatar size="md" name={user.name} src={user.avatar} />
                <Text fontSize="lg" fontWeight="bold">
                  {user.name}
                </Text>
              </HStack>
              {user.unreadMessages > 0 && (
                <Badge colorScheme="red" variant="solid" px={2} py={1}>
                  {user.unreadMessages}
                </Badge>
              )}
            </HStack>
          </Button>
        ))}
      </VStack>
    </Box>
  );
}

export default ChatSideBar;
