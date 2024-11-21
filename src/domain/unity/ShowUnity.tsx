import { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import {
  Box,
  Button,
  Heading,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";

interface ShowUnityProps {
  roomCode: string;
}

const ShowUnity = ({ roomCode }: ShowUnityProps) => {
  const { unityProvider, isLoaded, sendMessage } = useUnityContext({
    loaderUrl: "/Build/ws-test.loader.js",
    dataUrl: "/Build/ws-test.data",
    frameworkUrl: "/Build/ws-test.framework.js",
    codeUrl: "/Build/ws-test.wasm",
  });

  const [isUnityReady, setIsUnityReady] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null); // 선택한 방
  const [showRoomSelection, setShowRoomSelection] = useState(true); // 방 선택 팝업

  useEffect(() => {
    if (isLoaded) {
      console.log("Unity is loaded");
      setIsUnityReady(true);
    } else {
      console.log("Unity is loading...");
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isUnityReady && selectedRoom) {
      const message = `${roomCode}-${selectedRoom}`;
      sendMessage("Walking", "ReceiveCode", message);
      console.log(`Room code sent to Unity: ${message}`);
    }
  }, [isUnityReady, selectedRoom, roomCode, sendMessage]);

  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
    setShowRoomSelection(false); // 팝업 닫기
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
        <Box
          w="960px"
          h="600px"
          mt="20px"
          mx="auto"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          overflow="hidden"
        >
          <Unity
            unityProvider={unityProvider}
            style={{ width: "100%", height: "100%" }}
          />
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

export default ShowUnity;
