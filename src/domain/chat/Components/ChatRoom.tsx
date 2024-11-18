import { VStack, Box, Text } from "@chakra-ui/react";

interface Message {
  cr_id: number;
  sender_id: string;
  receiver_id: string;
  message_content: string;
  sent_at: string;
  read: boolean;
  message_type: string;
}

interface ChatRoomProps {
  messages: Message[]; // 받아온 메시지 목록
  userId: string; // 현재 사용자 ID
}

function ChatRoom({ messages, userId }: ChatRoomProps) {
  return (
    <VStack
      align="stretch"
      flex="1"
      spacing={4}
      overflowY="auto"
      bg={"gray.50"}
      p={3}
    >
      {messages.map((msg, index) => (
        <Box
          key={index}
          alignSelf={msg.sender_id === userId ? "flex-end" : "flex-start"}
          bg={msg.sender_id === userId ? "blue.100" : "gray.200"}
          p={3}
          borderRadius="md"
          shadow="base"
          maxWidth="70%"
        >
          <Text fontSize="md" wordBreak="break-word">
            {msg.message_content}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}

export default ChatRoom;
