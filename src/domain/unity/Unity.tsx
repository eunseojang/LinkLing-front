import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Select,
  VStack,
  HStack,
  Progress,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";

interface Language {
  code: string;
  label: string;
  sttConfig: {
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives?: number;
  };
}

interface VoiceChatProps {
  roomId: string;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ roomId: initialRoomId }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>(initialRoomId || "");
  const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(!!initialRoomId);
  const [localVolume, setLocalVolume] = useState<number>(0);
  const [remoteVolume, setRemoteVolume] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");

  const languages: Language[] = [
    {
      code: "ko-KR",
      label: "한국어",
      sttConfig: { continuous: true, interimResults: true },
    },
    {
      code: "en-US",
      label: "English",
      sttConfig: { continuous: true, interimResults: true },
    },
    {
      code: "zh-CN",
      label: "中文",
      sttConfig: { continuous: true, interimResults: true, maxAlternatives: 1 },
    },
    {
      code: "ja-JP",
      label: "日本語",
      sttConfig: { continuous: true, interimResults: true },
    },
  ];

  const joinRoom = () => {
    if (roomId.trim() === "") {
      alert("Please enter a valid room ID.");
      return;
    }
    setIsConnected(true); // Mock connection for UI demo
    setHasJoinedRoom(true);
  };

  const endCall = () => {
    setIsConnected(false);
    setHasJoinedRoom(false);
    setIsAudioOn(false);
  };

  return (
    <Box
      p={4}
      maxW="600px"
      mx="auto"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading size="lg" mb={4}>
        1:1 Voice Chat
      </Heading>
      {!hasJoinedRoom ? (
        <VStack spacing={4}>
          <Input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Button colorScheme="blue" onClick={joinRoom}>
            Join Room
          </Button>
        </VStack>
      ) : (
        <VStack spacing={4}>
          <Alert status={isConnected ? "success" : "error"}>
            <AlertIcon />
            <AlertTitle>
              {isConnected ? "Connected to the Room" : "Disconnected"}
            </AlertTitle>
          </Alert>

          {isConnected && (
            <>
              <HStack>
                <Button colorScheme="red" onClick={endCall}>
                  End Call
                </Button>
                <Button onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </HStack>

              <HStack w="100%" spacing={4}>
                <VStack flex={1}>
                  <Text>Your Voice Volume</Text>
                  <Progress
                    value={localVolume}
                    size="sm"
                    colorScheme="green"
                    width="100%"
                  />
                </VStack>
                <VStack flex={1}>
                  <Text>Remote Voice Volume</Text>
                  <Progress
                    value={remoteVolume}
                    size="sm"
                    colorScheme="green"
                    width="100%"
                  />
                </VStack>
              </HStack>

              <Select
                placeholder="Select Language"
                onChange={(e) => setTranscript("")}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </Select>

              <Box p={2} borderWidth="1px" borderRadius="md" w="100%">
                <Text fontWeight="bold" mb={2}>
                  Voice Transcript:
                </Text>
                <Text whiteSpace="pre-wrap">{transcript}</Text>
                <Button
                  mt={2}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => setTranscript("")}
                >
                  Clear Transcript
                </Button>
              </Box>
            </>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default VoiceChat;
