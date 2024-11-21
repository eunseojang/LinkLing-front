import { VStack, Box, Text, HStack, Flex } from "@chakra-ui/react";

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
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      hour12: true, // 12시간제로 표시
    }).format(date);
  };
  return (
    <VStack
      align="stretch"
      flex="1"
      spacing={4}
      overflowY="auto"
      bg={"#F7F9F4"}
      p={3}
    >
      {messages.map((msg, index) => (
        <HStack
          key={index}
          alignSelf={msg.sender_id === userId ? "flex-end" : "flex-start"}
          spacing={1}
        >
          {/* 1 표시 (읽지 않은 경우) */}
          {msg.sender_id === userId && !msg.read && (
            <Flex
              flexDirection="column"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Text fontSize="sm" color="linkling">
                1
              </Text>
              <Text fontSize="xs" color="gray.500">
                {formatTime(msg.sent_at)} {/* 시간 표시 */}
              </Text>
            </Flex>
          )}

          {/* 메시지 박스 */}
          <Box
            bg={msg.sender_id === userId ? "linkling.200" : "gray.200"}
            p={3}
            borderRadius="md"
            shadow="base"
          >
            <Text fontSize="md" wordBreak="break-word">
              {msg.message_content}
            </Text>
          </Box>
        </HStack>
      ))}
    </VStack>
  );
}

export default ChatRoom;
