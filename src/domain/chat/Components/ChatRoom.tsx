import { VStack, Text } from "@chakra-ui/react";

function ChatRoom() {
  return (
    <VStack
      align="stretch"
      flex="1"
      spacing={4}
      overflowY="auto"
      bg={"gray.50"}
      p={3}
    >
      <>
        <Text
          alignSelf="flex-start"
          bg="linkling.100"
          p={4}
          borderRadius="lg"
          shadow="md"
        >
          안녕하세요, 무엇을 도와드릴까요?
        </Text>
        <Text
          alignSelf="flex-end"
          bg="linkling.200"
          p={4}
          borderRadius="lg"
          shadow="md"
        >
          네, 안녕하세요. 질문이 있습니다.
        </Text>
        <Text
          alignSelf="flex-start"
          bg="linkling.100"
          p={4}
          borderRadius="lg"
          shadow="md"
        >
          네, 어떤 질문인지 말씀해 주세요.
        </Text>
      </>
    </VStack>
  );
}

export default ChatRoom;
