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
import { getFriendList } from "../api/ChatAPI";

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
  
  useEffect(() => {
    const initializeChat = async () => {
      const urlParams = new URLSearchParams(location.search); // 쿼리 파라미터 가져오기
      const roomIdString = urlParams.get("roomId");

      if (roomIdString) {
        const roomId = parseInt(roomIdString, 10);

        try {
          const friendList = await getFriendList();
          const foundUser = friendList.find(
            (friend: any) => friend.cr_id === roomId
          );

          if (foundUser) {
            setSelectedUser(foundUser);
            setCrId(roomId);
          } else {
            console.error("해당 roomId에 일치하는 사용자가 없습니다.");
          }
        } catch (error) {
          console.error("친구 목록 가져오기 오류:", error);
        }
      } else {
        setSelectedUser(null); // roomId가 없으면 선택된 사용자 초기화
        setCrId(null);
      }
    };

    initializeChat();
  }, [location.search]); // 쿼리 파라미터가 변경될 때 실행

  // selectedUser와 crId가 설정되었을 때 채팅방 열기
  useEffect(() => {
    if (selectedUser && crId !== null) {
      enterRoom(selectedUser, crId);
    }
  }, [selectedUser, crId]);

  const handleChatGo = async (id: number) => {
    const friendList = await getFriendList();
    const foundUser = friendList.find((friend: any) => friend.cr_id === id);

    if (foundUser) {
      setSelectedUser(foundUser);
      setCrId(id);
    }
  };

  // 방에 입장
  const enterRoom = (user: User, roomCrId: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("roomId", roomCrId.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl); // URL 업데이트

    if (wsRef.current) {
      const enterPayload = {
        message_type: "ENTER",
        sender_id: id,
        cr_id: roomCrId,
        receiver_id: user.user_id,
      };

      wsRef.current.send(JSON.stringify(enterPayload));
    }
  };

  // 메시지 보내기
  const sendMessage = (messageContent: string) => {
    if (wsRef.current && selectedUser && crId) {
      const chatPayload = {
        message_type: "CHAT",
        sender_id: id,
        receiver_id: selectedUser.user_id,
        cr_id: crId,
        message_content: messageContent,
      };

      wsRef.current.send(JSON.stringify(chatPayload));
      console.log("메시지 전송:", chatPayload);
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
            <ChatRoom
              translateMode={translateMode}
              messages={messages}
              userId={id}
            />
            <MessageInput sendMessage={sendMessage} />
          </>
        ) : (
          <Flex m={"auto"}>
            <MatchingComponent />
            <FriendComponent handleChatGo={handleChatGo} />
          </Flex>
        )}
      </Box>
    </HStack>
  );
};

export default ChatComponent;
