import { Box, Flex, HStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import ChatRoom from "./ChatRoom";
import { User } from "../Utils/ChatUtils";
import ChatAppBar from "./ChatAppBar";
import ChatSideBar from "./ChatSideBar";
import MatchingComponent from "./MatchingCompontnet";
import FriendComponent from "./FriendComponent";
import { getNicknameToken } from "../../../common/utils/nickname";

const WS_URL = "wss://unbiased-evenly-worm.ngrok-free.app/chat";

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [translateMode, setTranslateMode] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]); // 메시지 리스트
  const [crId, setCrId] = useState<number | null>(null); // 현재 방 ID
  const wsRef = useRef<WebSocket | null>(null);
  const id = getNicknameToken();

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket 연결 성공");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === "HISTORY") {
          setMessages(data.messages); // 이전 메시지 로드
        } else if (data.type === "READ") {
          console.log("상대방이 메시지를 읽음:", data.messages);
        } else if (data.message_type === "CHAT") {
          setMessages((prev) => [...prev, data]); // 새로운 메시지 추가
        }
      } catch (err) {
        console.error("WebSocket 메시지 처리 중 오류:", err);
      }
    };

    ws.onclose = (event) => {
      console.error("WebSocket 연결 종료:", event.code, event.reason);
    };

    ws.onerror = (err) => {
      console.error("WebSocket 에러:", err);
    };

    return () => {
      ws.close();
    };
  }, []);

  // 방에 입장
  const enterRoom = (user: User, roomCrId: number) => {
    console.log(roomCrId);
    console.log(selectedUser);
    setSelectedUser(user);

    // 현재 URL 쿼리 업데이트
    const params = new URLSearchParams(window.location.search);
    params.set("roomId", roomCrId.toString()); // roomId 추가 또는 업데이트

    // URL 변경 (페이지 리로드 없이)
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl); // URL 변경
    console.log(`URL 변경됨: ${newUrl}`);

    if (wsRef.current) {
      setCrId(roomCrId);

      const enterPayload = {
        message_type: "ENTER",
        sender_id: id,
        cr_id: roomCrId,
        receiver_id: user?.user_id || null, // 선택한 유저가 없으면 null
      };

      wsRef.current.send(JSON.stringify(enterPayload));
      console.log("방에 입장했습니다.", enterPayload);
    }

    console.log(crId, selectedUser, "방입장상태");
  };

  // 메시지 보내기
  const sendMessage = (messageContent: string) => {
    console.log(selectedUser, crId);
    if (wsRef.current && selectedUser && crId) {
      const chatPayload = {
        message_type: "CHAT",
        sender_id: id,
        receiver_id: selectedUser.user_id,
        cr_id: crId,
        message_content: messageContent,
      };
      console.log(chatPayload);

      console.log(wsRef.current, "웹소켓 연결 상태");
      wsRef.current.send(JSON.stringify(chatPayload));
    }
  };

  return (
    <HStack spacing={0} width="100%" h={"100%"}>
      <ChatSideBar
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        enterRoom={enterRoom} // 방 입장 함수 전달
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
            <ChatRoom messages={messages} userId={id} />
            <MessageInput sendMessage={sendMessage} />
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
