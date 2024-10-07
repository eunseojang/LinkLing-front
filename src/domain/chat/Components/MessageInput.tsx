import { HStack, Input, IconButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";

function MessageInput() {
  const { t } = useTranslation();
  return (
    <HStack p={4} bg={"gray.50"} borderColor="gray.300">
      <Input
        placeholder={t(`chat.messageInputPla`) + "..."}
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
