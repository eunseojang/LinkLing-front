// CallPage.tsx
import { useState } from "react";
import { useWebSocket } from "./WebSocketContext";
import { Box, Input, Button } from "@chakra-ui/react";

const CallPage = () => {
  const { socket } = useWebSocket();
  const [toUserId, setToUserId] = useState("");

  const startCall = () => {
    if (socket && toUserId) {
      socket.send(`ALERT:TO:${toUserId}|MESSAGE:Call Request`);
      console.log(`Call request sent to ${toUserId}`);
    }
  };

  return (
    <Box p={4}>
      <Input
        placeholder="Enter User ID to call"
        value={toUserId}
        onChange={(e) => setToUserId(e.target.value)}
        mb={4}
      />
      <Button colorScheme="blue" onClick={startCall}>
        Start Call
      </Button>
    </Box>
  );
};

export default CallPage;
