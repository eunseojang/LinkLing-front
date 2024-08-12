import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./common/store/AuthStore";
import HomePage from "./domain/home/HomePage";
import LoginPage from "./domain/login/LoginPage";
import SignupPage from "./domain/signup/SingupPage";
import PrivateRoute from "./common/components/PrivateRoute";

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const authenticate = () => {
      checkAuth();
      console.log(isAuthenticated);
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
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
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
