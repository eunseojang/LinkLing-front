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
import SpeechPage from "./domain/chat/speech";
import SpeechToText from "./domain/chat/stt";
import TestPage from "./common/TestPage";
import { useTextSelection } from "./domain/community/hooks/useTextSelection";
import { translateText } from "./common/utils/translate";
import { useTranslation } from "react-i18next";
import { Box } from "@chakra-ui/react";
import PopoverMenu from "./domain/community/components/PopoverMenu";
import { detectDominantLanguage } from "./common/utils/language";

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedText, setMenuPosition, menuPosition, handleTextSelection } =
    useTextSelection(containerRef);
  const { i18n } = useTranslation();

  useEffect(() => {
    const authenticate = () => {
      checkAuth();
      setInitialized(true);
    };

    authenticate();
  }, [checkAuth]);

  if (!initialized) {
    return null;
  }

  const handleTranslateClick = async () => {
    if (selectedText) {
      const translatedText = await translateText(selectedText, i18n.language);
      setTranslatedText(translatedText);
    }
  };

  const handleSpeakClick = () => {
    if (selectedText) {
      const langCode = detectDominantLanguage(selectedText);
      const utterance = new SpeechSynthesisUtterance(selectedText);
      utterance.lang = langCode;
      speechSynthesis.speak(utterance);
    }
  };

  const handleTextSelectionWrapper = () => {
    handleTextSelection();
    setTranslatedText(null);
  };

  return (
    <Box onMouseUp={handleTextSelectionWrapper} ref={containerRef}>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<TestPage />} />

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
            path="/linkchat"
            element={<PrivateRoute element={<ChatPage />} />}
          />
          <Route
            path="/setting"
            element={<PrivateRoute element={<SettingPage />} />}
          />
          <Route path="/tts" element={<SpeechPage />} />
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
      </BrowserRouter>

      <PopoverMenu
        menuPosition={menuPosition}
        translatedText={translatedText}
        handleTranslateClick={handleTranslateClick}
        handleSpeakClick={handleSpeakClick}
        closeMenu={() => setMenuPosition(null)}
      />
    </Box>
  );
}

export default App;
