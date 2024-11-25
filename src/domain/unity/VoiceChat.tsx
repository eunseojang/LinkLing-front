import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Select,
  useToast,
} from "@chakra-ui/react";

interface VoiceChatProps {
  roomId: string;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ roomId }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [callState, setCallState] = useState<
    "idle" | "calling" | "connected" | "receiving"
  >("idle");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ko-KR");
  const toast = useToast();

  const webSocketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const webSocket = new WebSocket(
      `wss://${import.meta.env.VITE_API_URL}/voice-chat?roomId=${roomId}`
    );

    webSocketRef.current = webSocket;

    webSocket.onopen = () => {
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "WebSocket connected",
        status: "success",
      });
    };

    webSocket.onclose = () => {
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "WebSocket disconnected",
        status: "warning",
      });
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Error",
        description: "WebSocket error occurred",
        status: "error",
      });
    };
  }, []);

  const startCall = () => {
    if (webSocketRef.current) {
      webSocketRef.current.send(
        JSON.stringify({ type: "call-request", roomId })
      );
      setCallState("calling");
      console.log("calling");
    }
  };

  const endCall = () => {
    if (webSocketRef.current) {
      webSocketRef.current.send(JSON.stringify({ type: "call-end", roomId }));
      setCallState("idle");
    }
  };

  return (
    <Box
      w="100%"
      maxW="600px"
      mx="auto"
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Voice Chat
        </Text>

        {isConnected && (
          <VStack spacing={4} align="stretch">
            <Text>
              Connection Status: {isConnected ? "Connected" : "Disconnected"}
            </Text>

            {callState === "idle" && (
              <Button onClick={startCall} colorScheme="green">
                Start Call
              </Button>
            )}

            {callState === "calling" && (
              <Text textAlign="center" color="blue.500">
                Calling...
              </Text>
            )}

            {callState === "connected" && (
              <>
                <Button onClick={endCall} colorScheme="red">
                  End Call
                </Button>
                <Text>Your Volume Level:</Text>
              </>
            )}

            <HStack>
              <Text>Language:</Text>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                maxW="200px"
              >
                <option value="ko-KR">Korean</option>
                <option value="en-US">English</option>
                <option value="zh-CN">Chinese</option>
                <option value="ja-JP">Japanese</option>
              </Select>
            </HStack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default VoiceChat;
