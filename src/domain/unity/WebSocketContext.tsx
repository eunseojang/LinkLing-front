import React, { createContext, useState, useEffect, useContext } from "react";
import { getNicknameToken } from "../../common/utils/nickname";
import { useNavigate } from "react-router-dom";

interface WebSocketContextType {
  socket: WebSocket | null;
  notifications: string[];
  roomCode: string;
  toUserId: string;
  currentNotification: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate(); // React Router의 useNavigate 훅
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [roomCode, setRoomCode] = useState<string>("");
  const [currentNotification, setCurrentNotification] = useState<string | null>(
    null
  );
  const [toUserId, setToUserId] = useState<string>("");

  useEffect(() => {
    let pingInterval: any;

    const ws = new WebSocket(
      "wss://unbiased-evenly-worm.ngrok-free.app/join?userId=" +
        getNicknameToken()
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      const data = event.data;
      console.log(data);

      if (data.startsWith("ALERT:")) {
        const notification = data.replace("ALERT: ", "");
        setNotifications((prev) => [...prev, notification]);
        setCurrentNotification(notification);

        const senderIdMatch = data.match(/from (.+)\)/);
        if (senderIdMatch) {
          setToUserId(senderIdMatch[1]);
        }
      } else if (data.startsWith("Room code:")) {
        const receivedRoomCode = data.replace("Room code: ", "");
        setRoomCode(receivedRoomCode);

        // /unity/:roomCode 경로로 이동
        navigate(`/unity/${receivedRoomCode}`);
        console.log("Navigated to Unity with room code:", receivedRoomCode);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      clearInterval(pingInterval);
    };

    setSocket(ws);

    return () => {
      if (ws.readyState !== WebSocket.CLOSED) {
        ws.close();
      }
      clearInterval(pingInterval);
    };
  }, [navigate]);

  return (
    <WebSocketContext.Provider
      value={{ socket, notifications, roomCode, toUserId, currentNotification }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
