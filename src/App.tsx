import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import LingPage from "./domain/ling/LingPage";

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

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

  return (
    <BrowserRouter>
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
        <Route path="/ling" element={<PrivateRoute element={<LingPage />} />} />
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
  );
}

export default App;
