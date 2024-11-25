import { VStack, Box, Text, HStack, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { translateText } from "../../../common/utils/translate";

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
  translateMode: boolean;
}

function ChatRoom({ messages, userId, translateMode }: ChatRoomProps) {
  const { i18n } = useTranslation();

  // 번역된 메시지를 상태로 관리
  const [translatedMessages, setTranslatedMessages] = useState<string[]>([]);

  // Scroll reference
  const bottomRef = useRef<HTMLDivElement>(null);

  // 비동기 번역 작업 처리
  useEffect(() => {
    const fetchTranslations = async () => {
      if (translateMode) {
        const translations = await Promise.all(
          messages.map((msg) =>
            translateText(msg.message_content, i18n.language)
          )
        );

        // const translations = await Promise.all(
        //   messages.map((msg) =>
        //     msg.sender_id !== userId
        //       ? translateText(msg.message_content, i18n.language)
        //       : msg.message_content // 자신의 메시지는 번역하지 않음
        //   )
        // );

        setTranslatedMessages(translations);
      } else {
        setTranslatedMessages(messages.map((msg) => msg.message_content));
      }
    };
    fetchTranslations();
  }, [messages, translateMode, i18n.language]);

  // 새로운 메시지가 추가되면 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

          {msg.sender_id === userId && msg.read && (
            <Flex
              flexDirection="column"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
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
              {translatedMessages[index]}
            </Text>
          </Box>
        </HStack>
      ))}

      {/* 자동 스크롤용 Ref */}
      <div ref={bottomRef} />
    </VStack>
  );
}

export default ChatRoom;
