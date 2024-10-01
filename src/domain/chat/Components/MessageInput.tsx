import { HStack, Input, IconButton } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

function MessageInput() {
  return (
    <HStack p={4} bg={"gray.50"} borderColor="gray.300">
      <Input
        placeholder="메시지를 입력하세요..."
        bg={"white"}
        borderRadius="xl"
        shadow="md"
        py={6}
        fontSize="lg"
      />
      <IconButton
        aria-label="Send message"
        icon={<FiSend />}
        colorScheme="linkling"
        borderRadius="full"
        size="lg"
        _hover={{ bg: "linkling.300" }}
      />
    </HStack>
  );
}

export default MessageInput;
