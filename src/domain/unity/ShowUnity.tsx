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
import VoiceChat from "./VoiceChat";

type ChatMessage = {
  sender: string;
  content: string | undefined; // undefined를 허용
  timestamp: string;
  isMine: boolean;
};
type RoomMessage = {
  type: "room_select" | "chat";
  senderId: string;
  chatContent?: string;
  selectedRoom?: string;
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

  const { unityProvider, isLoaded, sendMessage } = useUnityContext({
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
      unityCanvas.style.pointerEvents = "none";
      unityCanvas.setAttribute("tabindex", "-1");
      unityCanvas.blur();
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

  // WebSocket 연결 설정
  useEffect(() => {
    if (roomCode) {
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
          const data: RoomMessage = JSON.parse(event.data);

          if (data.type === "room_select" && data.senderId !== myId) {
            setSelectedRoom(data.selectedRoom || null);
            setShowRoomSelection(false);
            if (isUnityReady && data.selectedRoom) {
              const message = `${roomCode}-${data.selectedRoom}`;
              sendMessage("Man", "ReceiveCode", message);
            }
          } else if (data.type === "chat" && data.chatContent) {
            if (data.senderId === "system" || data.senderId !== myId) {
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
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      return () => ws.current?.close();
    }
  }, [roomCode, isUnityReady, myId, sendMessage, toast]);

  // Unity 로딩 상태 감지
  useEffect(() => {
    if (isLoaded) {
      setIsUnityReady(true);
      console.log("Unity is loaded");
    }
  }, [isLoaded]);

  // Unity 로드 후 선택된 방 적용
  useEffect(() => {
    if (isUnityReady && selectedRoom && roomCode) {
      const message = `${roomCode}-${selectedRoom}`;
      sendMessage("Man", "ReceiveCode", message);
    }
  }, [isUnityReady, selectedRoom, roomCode, sendMessage]);

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

  // 채팅창 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputFocus = () => {
    setIsTyping(true);
    disableUnityInput();
  };

  const handleInputBlur = () => {
    if (document.activeElement === inputRef.current) {
      return;
    }
    setIsTyping(false);
    enableUnityInput();
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !ws.current) return;

    try {
      const chatMessage: RoomMessage = {
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
    if (ws.current) {
      const roomMessage: RoomMessage = {
        type: "room_select",
        senderId: myId,
        selectedRoom: room,
      };
      ws.current.send(JSON.stringify(roomMessage));
    }

    setSelectedRoom(room);
    setShowRoomSelection(false);
  };
  return (
    <Box position="relative" h="100vh">
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
        <Box position="relative" h="100vh">
          {/* Unity Container - Full screen */}
          <Box
            ref={unityContainerRef}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
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

          {/* Chat Overlay */}
          <Box
            position="absolute"
            bottom={4}
            left={4}
            w="30%"
            h="20vh"
            display="flex"
            flexDirection="column"
            bg="rgba(255, 255, 255, 0.1)"
            borderRadius="xl"
            boxShadow="lg"
            overflow="hidden"
            backdropFilter="blur(10px)"
          >
            {/* Chat Header */}
            <Flex
              p={2}
              bg="blue.500"
              color="white"
              alignItems="center"
              borderBottom="1px"
              borderColor="blue.600"
            >
              <Heading size="sm">Chat Room</Heading>
              <Text ml="auto" fontSize="sm">
                {roomCode || ""}
              </Text>
            </Flex>

            {/* Chat Messages */}
            <Box
              ref={chatContainerRef}
              flex={1}
              p={3}
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(241, 241, 241, 0.5)",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(136, 136, 136, 0.5)",
                  borderRadius: "4px",
                },
              }}
            >
              {messages.map((msg, index) => (
                <Flex
                  key={index}
                  mb={2}
                  justifyContent={msg.isMine ? "flex-end" : "flex-start"}
                >
                  <Box
                    maxW="80%"
                    bg={
                      msg.isMine
                        ? "blue.500"
                        : msg.sender === "System"
                        ? "gray.500"
                        : "gray.200"
                    }
                    color={
                      msg.isMine || msg.sender === "System" ? "white" : "black"
                    }
                    borderRadius="lg"
                    px={3}
                    py={1.5}
                    shadow="sm"
                  >
                    <Text
                      fontSize="xs"
                      color={
                        msg.isMine || msg.sender === "System"
                          ? "whiteAlpha.800"
                          : "gray.500"
                      }
                      mb={0.5}
                    >
                      {msg.sender} • {msg.timestamp}
                    </Text>
                    <Text fontSize="sm">{msg.content}</Text>
                  </Box>
                </Flex>
              ))}
            </Box>

            {/* Input Area */}
            <Box p={2} bg="white" borderTop="1px" borderColor="gray.100">
              <Flex>
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Type a message..."
                  mr={2}
                  bg="gray.50"
                  size="sm"
                  borderRadius="full"
                  _focus={{
                    bg: "white",
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                />
                <IconButton
                  aria-label="Send message"
                  icon={<SendIcon size={16} />}
                  onClick={handleSendMessage}
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                />
              </Flex>
            </Box>
          </Box>

          {/* Voice Chat */}
          <Box position="absolute" bottom={4} right={4}>
            <VoiceChat roomId={roomCode || ""} />
          </Box>
        </Box>
      )}

      {!isUnityReady && !showRoomSelection && (
        <Center
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Spinner size="xl" />
          <Box ml="10px">Loading Unity, please wait...</Box>
        </Center>
      )}
    </Box>
  );
};

export default ShowUnityWithVoiceChat;
