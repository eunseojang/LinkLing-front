import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "./common/store/AuthStore";
import HomePage from "./domain/home/HomePage";
import PrivateRoute from "./common/components/PrivateRoute";
import ProfilePage from "./domain/profile/ProfilePage";
import CommunityPage from "./domain/community/CommnunityPage";
import ChatPage from "./domain/chat/ChatPage";
import SignupPage from "./domain/auth/signup/SingupPage";
import OauthSignupPage from "./domain/auth/oauth/OauthSingupPage";
import AuthCallback from "./domain/auth/oauth/Components/AuthCallback";
import LoginPage from "./domain/auth/login/LoginPage";
import FindPasswordPage from "./domain/auth/findPassword/FindPasswordPage";
import SettingPage from "./domain/setting/SettingPage";
import SpeechToText from "./domain/chat/stt";
import { useTextSelection } from "./domain/community/hooks/useTextSelection";
import { translateText } from "./common/utils/translate";
import { useTranslation } from "react-i18next";
import { Box } from "@chakra-ui/react";
import PopoverMenu from "./domain/community/components/PopoverMenu";
import { detectDominantLanguage } from "./common/utils/language";
import LevelTestPage from "./domain/level/LevelTestPage";
import ShowUnity from "./domain/unity/ShowUnity";
import { WebSocketProvider } from "./domain/unity/WebSocketContext";
import NotificationBar from "./domain/unity/NotoficationBar";
import CallPage from "./domain/unity/CallPage";

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [initialized, setInitialized] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedText, setMenuPosition, menuPosition, handleTextSelection } =
    useTextSelection(containerRef);
  const { i18n } = useTranslation();
  const socketRef = useRef<WebSocket | null>(null); // WebSocket 인스턴스를 저장할 ref

  useEffect(() => {
    const authenticate = () => {
      checkAuth();
      setInitialized(true);
    };

    authenticate();
  }, [checkAuth]);

  useEffect(() => {
    if (
      !socketRef.current ||
      socketRef.current.readyState === WebSocket.CLOSED
    ) {
      const socket = new WebSocket(
        `wss://unbiased-evenly-worm.ngrok-free.app/ping`
      );
      socketRef.current = socket;
      socket.onopen = function () {
        console.log("WebSocket connection established");
        setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send("ping:" + localStorage.getItem("accessToken"));
            console.log("ping");
          }
        }, 60000);
      };
      socket.onmessage = function (event) {
        console.log("Message from server: ", event.data);
      };
      socket.onclose = function (event) {
        console.log("WebSocket connection closed", event);
        socketRef.current = null;
      };
      socket.onerror = function (event) {
        console.error("WebSocket error observed: ", event);
      };
    }
    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState !== WebSocket.CLOSED
      ) {
        socketRef.current.close();
      }
    };
  }, []);
  if (!initialized) {
    return null;
  }

  const handleTranslateClick = async () => {
    if (selectedText) {
      const translatedText = await translateText(selectedText, i18n.language);
      console.log(i18n.language);
      setTranslatedText(translatedText);
    }
  };

  const handleSpeakClick = () => {
    if (selectedText) {
      const langCode = detectDominantLanguage(selectedText);
      const utterance = new SpeechSynthesisUtterance(selectedText);
      utterance.lang = langCode;

      utterance.onend = () => console.log("발음이 완료되었습니다.");

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const handleTextSelectionWrapper = () => {
    handleTextSelection();
    setTranslatedText(null);
  };

  if (!initialized) {
    return null;
  }

  return (
    <BrowserRouter>
      <WebSocketProvider>
        <NotificationBar />
        <Box onMouseUp={handleTextSelectionWrapper} ref={containerRef}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/:nickName"
              element={<PrivateRoute element={<ProfilePage />} />}
            />
            <Route
              path="/community"
              element={<PrivateRoute element={<CommunityPage />} />}
            />
            <Route
              path="/leveltest"
              element={<PrivateRoute element={<LevelTestPage />} />}
            />
            <Route
              path="/linkchat"
              element={<PrivateRoute element={<ChatPage />} />}
            />
            <Route
              path="/setting"
              element={<PrivateRoute element={<SettingPage />} />}
            />
            <Route
              path="/unity/:roomCode"
              element={<PrivateRoute element={<ShowUnity />} />}
            />
            <Route path="/call" element={<CallPage />} />
            <Route path="/sst" element={<SpeechToText />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/oauth/:email" element={<OauthSignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/findpassword" element={<FindPasswordPage />} />
            <Route path="/" element={<HomePage />} />
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>

          <PopoverMenu
            menuPosition={menuPosition}
            translatedText={translatedText}
            handleTranslateClick={handleTranslateClick}
            handleSpeakClick={handleSpeakClick}
            closeMenu={() => setMenuPosition(null)}
          />
        </Box>
      </WebSocketProvider>
    </BrowserRouter>
  );
}

export default App;
