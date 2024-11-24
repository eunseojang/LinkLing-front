import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Input,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { SendIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Unity, useUnityContext } from "react-unity-webgl";
import VoiceChat from "./Unity";

type ChatMessage = {
  sender: string;
  content: string;
  timestamp: string;
  isMine: boolean;
};

const ShowUnityWithVoiceChat = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [myId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const unityContainerRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const toast = useToast();

  const {
    unityProvider,
    isLoaded,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "/Build/ws-test.loader.js",
    dataUrl: "/Build/ws-test.data",
    frameworkUrl: "/Build/ws-test.framework.js",
    codeUrl: "/Build/ws-test.wasm",
  });

  const [isUnityReady, setIsUnityReady] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showRoomSelection, setShowRoomSelection] = useState(true);

  // Unity 이벤트 제어
  const disableUnityInput = useCallback(() => {
    const unityCanvas = unityContainerRef.current?.querySelector("canvas");
    if (unityCanvas) {
      // Unity 캔버스의 모든 입력 이벤트를 비활성화
      unityCanvas.style.pointerEvents = "none";
      // 캔버스의 tabIndex를 -1로 설정하여 포커스를 받지 않도록 함
      unityCanvas.setAttribute("tabindex", "-1");
      // 캔버스에서 포커스 제거
      unityCanvas.blur();
      // Unity WebGL의 키보드 캡처 비활성화를 위한 스타일 추가
      unityCanvas.style.outline = "none";
      document.body.style.cursor = "default";
    }
  }, []);

  const enableUnityInput = useCallback(() => {
    const unityCanvas = unityContainerRef.current?.querySelector("canvas");
    if (unityCanvas) {
      unityCanvas.style.pointerEvents = "auto";
      unityCanvas.setAttribute("tabindex", "0");
      unityCanvas.style.outline = "";
      if (!isTyping) {
        unityCanvas.focus();
      }
    }
  }, [isTyping]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const preventUnityInput = (e: KeyboardEvent) => {
      if (isTyping) {
        e.stopImmediatePropagation();
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      }
    };

    const preventKeyboardCapture = () => {
      if (isTyping) {
        disableUnityInput();
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("keydown", preventUnityInput, true);
    window.addEventListener("keyup", preventUnityInput, true);
    window.addEventListener("keypress", preventUnityInput, true);
    document.addEventListener("click", preventKeyboardCapture, true);

    return () => {
      window.removeEventListener("keydown", preventUnityInput, true);
      window.removeEventListener("keyup", preventUnityInput, true);
      window.removeEventListener("keypress", preventUnityInput, true);
      document.removeEventListener("click", preventKeyboardCapture, true);
    };
  }, [isTyping, disableUnityInput]);

  // Unity 로딩 상태 감지
  useEffect(() => {
    if (isLoaded) {
      setIsUnityReady(true);
      console.log("Unity is loaded");
    }
  }, [isLoaded]);

  // WebSocket 연결 관리
  useEffect(() => {
    if (isUnityReady && selectedRoom && roomCode) {
      const message = `${roomCode}-${selectedRoom}`;
      sendMessage("Walking", "ReceiveCode", message);

      const wsUrl = `wss://unbiased-evenly-worm.ngrok-free.app/real-time-chat?code=${roomCode}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket Connected");
        toast({
          title: "Connected",
          status: "success",
          duration: 2000,
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (
            data.type === "chat" &&
            (data.senderId === "system" || data.senderId !== myId)
          ) {
            setMessages((prev) => [
              ...prev,
              {
                sender: data.senderId === "system" ? "System" : "Other",
                content: data.chatContent,
                timestamp: new Date().toLocaleTimeString(),
                isMine: false,
              },
            ]);
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      return () => ws.current?.close();
    }
  }, [isUnityReady, selectedRoom, roomCode, sendMessage, myId, toast]);

  // 채팅창 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 채팅 입력 관련 핸들러
  const handleInputFocus = () => {
    setIsTyping(true);
    disableUnityInput();
  };

  const handleInputBlur = () => {
    // 입력창이 여전히 포커스를 가지고 있는지 확인
    if (document.activeElement === inputRef.current) {
      return;
    }
    setIsTyping(false);
    enableUnityInput();
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !ws.current) return;

    try {
      const chatMessage = {
        type: "chat",
        senderId: myId,
        chatContent: inputMessage,
      };

      ws.current.send(JSON.stringify(chatMessage));
      setMessages((prev) => [
        ...prev,
        {
          sender: "Me",
          content: inputMessage,
          timestamp: new Date().toLocaleTimeString(),
          isMine: true,
        },
      ]);

      setInputMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
    setShowRoomSelection(false);
  };

  return (
    <Box>
      {showRoomSelection ? (
        <Center h="100vh">
          <VStack spacing={4}>
            <Heading size="md">Select a Room:</Heading>
            <Button
              colorScheme="blue"
              onClick={() => handleRoomSelect("korea")}
              width="200px"
            >
              Korea
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handleRoomSelect("china")}
              width="200px"
            >
              China
            </Button>
            <Button
              colorScheme="green"
              onClick={() => handleRoomSelect("japan")}
              width="200px"
            >
              Japan
            </Button>
            <Button
              colorScheme="purple"
              onClick={() => handleRoomSelect("usa")}
              width="200px"
            >
              USA
            </Button>
          </VStack>
        </Center>
      ) : (
        <Box>
          <Box
            ref={unityContainerRef}
            w="960px"
            h="600px"
            mt="20px"
            mx="auto"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            overflow="hidden"
            position="relative"
            backgroundColor="black"
          >
            <Unity
              unityProvider={unityProvider}
              style={{ width: "100%", height: "100%" }}
            />
            {isTyping && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="transparent"
                zIndex={1}
                onClick={() => inputRef.current?.focus()}
              />
            )}
          </Box>

          <Box
            w="960px"
            mx="auto"
            mt="4"
            mb="4"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            bg="white"
          >
            <Box
              ref={chatContainerRef}
              h="200px"
              p="4"
              overflowY="auto"
              backgroundColor="gray.50"
              css={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "4px",
                },
              }}
            >
              {messages.map((msg, index) => (
                <Flex
                  key={index}
                  mb="2"
                  justifyContent={msg.isMine ? "flex-end" : "flex-start"}
                >
                  <Box
                    maxW="70%"
                    bg={
                      msg.isMine
                        ? "blue.100"
                        : msg.sender === "System"
                        ? "gray.200"
                        : "gray.100"
                    }
                    borderRadius="lg"
                    px="3"
                    py="2"
                    shadow="sm"
                  >
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      {msg.sender} • {msg.timestamp}
                    </Text>
                    <Text>{msg.content}</Text>
                  </Box>
                </Flex>
              ))}
            </Box>

            <Flex p="3" borderTop="1px" borderColor="gray.200">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Type a message..."
                mr="2"
              />
              <IconButton
                aria-label="Send message"
                icon={<SendIcon />}
                onClick={handleSendMessage}
                colorScheme="blue"
              />
            </Flex>
          </Box>

          <Box mt="20px">
            <VoiceChat roomId={roomCode || ""} />
          </Box>
        </Box>
      )}

      {!isUnityReady && !showRoomSelection && (
        <Center mt="20px">
          <Spinner size="xl" />
          <Box ml="10px">Loading Unity, please wait...</Box>
        </Center>
      )}
    </Box>
  );
};

export default ShowUnityWithVoiceChat;
