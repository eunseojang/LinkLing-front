import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./common/store/AuthStore";
import HomePage from "./domain/home/HomePage";
import LoginPage from "./domain/login/LoginPage";
import SignupPage from "./domain/signup/SingupPage";
import PrivateRoute from "./common/components/PrivateRoute";
import AuthCallback from "./domain/signup/Components/AuthCallback";
import OauthSignupPage from "./domain/oauth/OauthSingupPage";
import FindPasswordPage from "./domain/findPassword/FindPasswordPage";
import ProfilePage from "./domain/profile/ProfilePage";

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
    return null; // 로딩 상태를 표시할 수도 있습니다.
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
        <Route
          path="/:nickName"
          element={<PrivateRoute element={<ProfilePage />} />}
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/oauth" element={<OauthSignupPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/findpassword" element={<FindPasswordPage />} />
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
