import { Box, Flex, HStack } from "@chakra-ui/react";
import { useState } from "react";
import MessageInput from "./MessageInput";
import ChatRoom from "./ChatRoom";
import { User } from "../Utils/ChatUtils";
import ChatAppBar from "./ChatAppBar";
import ChatSideBar from "./ChatSideBar";
import MatchingComponent from "./MatchingCompontnet";
import FriendComponent from "./FriendComponent";

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [translateMode, setTranslateMode] = useState<boolean>(false);

  return (
    <HStack spacing={0} width="100%" h={"100%"}>
      <ChatSideBar
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <Box
        flex="1"
        h={"100%"}
        bg={"customGreen"}
        display="flex"
        flexDirection="column"
        borderRadius="xl"
      >
        {selectedUser ? (
          <>
            <ChatAppBar
              selectedUser={selectedUser}
              translateMode={translateMode}
              setTranslateMode={setTranslateMode}
            />
            <ChatRoom />
            <MessageInput />
          </>
        ) : (
          <Flex m={"auto"}>
            <MatchingComponent />
            <FriendComponent />
          </Flex>
        )}
      </Box>
    </HStack>
  );
};

export default ChatComponent;
