import React from "react";
import { Box } from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import ChatComponent from "./Components/ChatComponent";

const ChatPage: React.FC = () => {
  return (
    <Box bg={"#F7F9F4"}>
      <AppBar />
      <Box mt={"60px"} h={`calc(100vh - 60px)`}>
        <ChatComponent />
      </Box>
    </Box>
  );
};

export default ChatPage;
