import { HStack, Input, IconButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";
import { useState } from "react";

interface MessageInputProps {
  sendMessage: (messageContent: string) => void;
}

function MessageInput({ sendMessage }: MessageInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim()); // 상위 컴포넌트로 메시지 전달
      setInputValue(""); // 입력 필드 초기화
    }
  };

  return (
    <HStack p={4} bg={"gray.50"} borderColor="gray.300">
      <Input
        placeholder={t(`chat.messageInputPla`) + "..."}
        bg={"white"}
        borderRadius="xl"
        shadow="md"
        py={6}
        fontSize="lg"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()} // Enter 키로 전송
      />
      <IconButton
        aria-label="Send message"
        icon={<FiSend />}
        colorScheme="linkling"
        borderRadius="full"
        size="lg"
        _hover={{ bg: "linkling.300" }}
        onClick={handleSend} // 버튼 클릭으로 전송
      />
    </HStack>
  );
}

export default MessageInput;
