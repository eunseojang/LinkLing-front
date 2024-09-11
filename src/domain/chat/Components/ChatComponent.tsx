import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Avatar,
} from "@chakra-ui/react";

const ChatComponent = () => {
  return (
    <HStack spacing={0} width="100%" h={"100%"}>
      <Box width="300px" bg="gray.100" p={4} h={"100%"}>
        <Button width="100%" colorScheme="linkling" mb={2}>
          랜덤 매칭
        </Button>
        <VStack align="stretch" spacing={3}>
          <Button colorScheme="customGreen" variant="outline">
            모든 친구
          </Button>
          <Button width="100%" colorScheme="gray">
            <HStack>
              <Avatar size="sm" />
              <Text>김철수</Text>
            </HStack>
          </Button>
          <Button width="100%" colorScheme="gray">
            <HStack>
              <Avatar size="sm" />
              <Text>이영희</Text>
            </HStack>
          </Button>
        </VStack>
      </Box>

      {/* Chat Window */}
      <Box
        flex="1"
        h={"100%"}
        bg="gray.50"
        p={4}
        display="flex"
        flexDirection="column"
      >
        <VStack align="stretch" flex="1" spacing={4} overflowY="auto">
          <Text
            alignSelf="flex-start"
            bg="linkling.100"
            p={3}
            borderRadius="md"
          >
            안녕하세요, 무엇을 도와드릴까요?
          </Text>
          <Text alignSelf="flex-end" bg="linkling.200" p={3} borderRadius="md">
            네, 안녕하세요. 질문이 있습니다.
          </Text>
          <Text
            alignSelf="flex-start"
            bg="linkling.100"
            p={3}
            borderRadius="md"
          >
            네, 어떤 질문인지 말씀해 주세요.
          </Text>
        </VStack>
        <HStack mt={4}>
          <Input placeholder="메시지를 입력하세요..." />
          <Button colorScheme="linkling">전송</Button>
        </HStack>
      </Box>
    </HStack>
  );
};

export default ChatComponent;
